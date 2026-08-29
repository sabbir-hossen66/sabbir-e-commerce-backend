export interface MagicLink {
    id: string;
    email: string;
    token_hash: string;
    expires_at: Date;
    used_at: Date | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: Date;
}
