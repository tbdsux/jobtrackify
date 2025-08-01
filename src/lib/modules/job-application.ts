export type JobType =
	| 'full-time'
	| 'part-time'
	| 'contract'
	| 'internship'
	| 'freelance'
	| 'temporary'
	| 'other';

export const jobTypes: Record<JobType, string> = {
	'full-time': 'Full Time',
	'part-time': 'Part Time',
	contract: 'Contract',
	internship: 'Internship',
	freelance: 'Freelance',
	temporary: 'Temporary',
	other: 'Other'
};

export type ApplicationStatus =
	| 'applied'
	| 'interview'
	| 'offer'
	| 'rejected'
	| 'accepted'
	| 'applicantRejected'
	| 'no response'
	| 'withdrawn'
	| 'initial interview';

export const applicationStatuses: Record<ApplicationStatus, string> = {
	applied: 'Applied',
	interview: 'Interview',
	offer: 'Offer',
	rejected: 'Rejected',
	accepted: 'Accepted',
	applicantRejected: 'Applicant Rejected',
	'no response': 'No Response',
	withdrawn: 'Withdrawn',
	'initial interview': 'Initial Interview'
};

export type InterviewType = 'video-call' | 'phone-call' | 'face-to-face' | 'others';

export const interviewTypes: Record<InterviewType, string> = {
	'video-call': 'Video Call',
	'phone-call': 'Phone Call',
	'face-to-face': 'Face to face',
	others: 'Others'
};
