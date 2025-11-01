import { env } from '$env/dynamic/private';
import { db } from '$lib/kysely';
import { s3Client } from '$lib/s3-client';
import { Upload } from '@aws-sdk/lib-storage';
import { redirect } from '@sveltejs/kit';
import type { Selectable } from 'kysely';
import type { ResumeUpload } from 'kysely-codegen';
import { nanoid } from 'nanoid';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { uploadResumeSchema } from './file-schema';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		throw redirect(303, '/auth');
	}

	// Query existing uploaded resumes
	const userResumes = (await db
		.selectFrom('resume_upload')
		.where('user_id', '=', user.id)
		.orderBy('uploaded_at', 'desc')
		.selectAll()
		.execute()) as Selectable<ResumeUpload>[];

	return {
		form: await superValidate({}, zod4(uploadResumeSchema)),
		userResumes: userResumes.map((item) => ({
			...item,
			fileUrl: `${env.CDN_CLOUDFLARE_URL}/${item.file_key}`
		}))
	};
};

export const actions: Actions = {
	upload: async (event) => {
		const user = event.locals.user;
		if (!user) {
			throw redirect(303, '/auth');
		}

		const form = await superValidate(event, zod4(uploadResumeSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const files = form.data.files;

		try {
			const uploadPromises = files.map(async (item) => {
				const id = nanoid();
				const fileKey = `${user.id}/resumes/${id}/${item.name}`;

				const upload = new Upload({
					client: s3Client,
					params: {
						Bucket: env.B2_BUCKET_NAME,
						Key: fileKey,
						Body: item,
						ContentType: item.type
					}
				});

				await upload.done();

				return {
					item,
					fileKey
				};
			});

			const uploadedFiles = await Promise.all(uploadPromises);

			await db
				.insertInto('resume_upload')
				.values(
					uploadedFiles.map((item) => ({
						user_id: user.id,
						file_name: item.item.name,
						file_key: item.fileKey,
						file_size: item.item.size
					}))
				)
				.execute();
		} catch (err) {
			console.error('Upload resumes error:', err);
			return fail(500, { form, message: 'Failed to upload resumes. Please try again.' });
		}

		return message(form, 'Resumes uploaded successfully!');
	}
};
