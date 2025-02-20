type Lov = {
	id: string;
	lovCategoryId: string;
	organizationId: string | null;
	value: string;
	description: string;
	activeFlag: number;
};

export type LovResponse = Lov[];

export type LovPayload = "BT" | "Title";

export interface CountryDataType {
	id: string;
	countryName: string;
	countryCode: string;
	states: {
		id: string;
		name: string;
		nationalityId: string;
		localGovernmentAreas: {
			id: string;
			name: string;
			stateId: string;
			taxLocations: {
				id: string;
				name: string;
				localGovernmentAreaId: string;
			}[];
		}[];
	}[];
}
