export type CreateBusinessPayload = {
	uuid?: string;
	name: string;
	email: string;
	is_active?: boolean;
};

export type ToggleBusinessPayload = {
	uuid: string;
    reason?: string;
	is_active: boolean;
    notify: boolean;
};

export type BusinessType = {
    id?: string;
    name?: string;
    email?: string;
    phone_number?: string;
    phoneNumber?: string;
    uuid?: string;
    status_id?: string;
    fee_bearer?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}

export type Meta = {
    next_page: number;
    previous_page: number;
    current_page: number;
    per_page: number;
    total_pages: number;
}

export type BusinessesResponseData = {
    businesses: BusinessType[];
    businessesCount: number;
    totalBusinesses: number;
    totalActiveBusinesses: number;
    totalInactiveBusinesses: number;
    meta: Meta;
}

export type BusinessQueryPayload = {
	search?: string;
	status?: "Active" | "Inactive";
	start?: string | null;
	end?: string | null;
	page?: number;
	per_page?: number;
	environment?: "test" | "live";
}

export type BusinessStatusAuditLogRecord = {
    id: string,
    admin_full_name: string,
    reason?: string;
    type: string,
    action: string,
    admin_email: string,
    time: string
}
