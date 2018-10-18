export interface Rule34XXXRawImageData {
    height: number;
    score: number;
    file_url: string;
    parent_id: string;
    sample_url: string;
    sample_width: number;
    sample_height: number;
    preview_url: string;
    rating: string;
    tags: string;
    id: number;
    width: number;
    change: number;
    md5: string;
    creator_id: number;
    has_children: boolean;
    created_at: Date;
    status: string;
    source: string;
    has_notes: boolean;
    has_comments: boolean;
    preview_width: number;
    preview_height: number;
}

export interface Rule34XXXParsedData {
    posts: {
        count: number;
        offset: number;
        post?: Rule34XXXRawImageData[];
    };
}

export interface Rule34XXXImage {
    url: string;
    tags: string[];
}
