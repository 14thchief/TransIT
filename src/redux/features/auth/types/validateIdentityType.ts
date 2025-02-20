export type ValidateIdPayload = {
	identityType: string;
	identityNumber: string;
	firstname: string;
	surname: string;
	middlename?: string;
};

export type ValidateResponse = {
	status: number;
	message: string;
	errorMessage: string | null;
	lastUpdate: number;
	data: null;
};
