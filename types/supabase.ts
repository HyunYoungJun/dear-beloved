export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    updated_at: string | null
                    username: string | null
                    full_name: string | null
                    avatar_url: string | null
                    website: string | null
                }
                Insert: {
                    id: string
                    updated_at?: string | null
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    website?: string | null
                }
                Update: {
                    id?: string
                    updated_at?: string | null
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    website?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            obituaries: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    user_id: string
                    deceased_name: string
                    birth_date: string | null
                    death_date: string | null
                    title: string
                    content: string | null
                    main_image_url: string | null
                    is_public: boolean
                    timeline_data: Json | null
                    flower_count: number
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    user_id: string
                    deceased_name: string
                    birth_date?: string | null
                    death_date?: string | null
                    title: string
                    content?: string | null
                    main_image_url?: string | null
                    is_public?: boolean
                    timeline_data?: Json | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    user_id?: string
                    deceased_name?: string
                    birth_date?: string | null
                    death_date?: string | null
                    title?: string
                    content?: string | null
                    main_image_url?: string | null
                    is_public?: boolean
                    timeline_data?: Json | null
                }
                Relationships: [
                    {
                        foreignKeyName: "obituaries_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            memories: {
                Row: {
                    id: string
                    obituary_id: string
                    author: string
                    content: string
                    image_url: string | null
                    created_at: string
                    flower_count: number
                }
                Insert: {
                    id?: string
                    obituary_id: string
                    author: string
                    content: string
                    image_url?: string | null
                    created_at?: string
                    flower_count?: number
                }
                Update: {
                    id?: string
                    obituary_id?: string
                    author?: string
                    content?: string
                    image_url?: string | null
                    created_at?: string
                    flower_count?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "memories_obituary_id_fkey"
                        columns: ["obituary_id"]
                        referencedRelation: "obituaries"
                        referencedColumns: ["id"]
                    }
                ]
            }
            family_relations: {
                Row: {
                    id: string
                    obituary_id: string
                    related_obituary_id: string
                    relation_type: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    obituary_id: string
                    related_obituary_id: string
                    relation_type: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    obituary_id?: string
                    related_obituary_id?: string
                    relation_type?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "family_relations_obituary_id_fkey"
                        columns: ["obituary_id"]
                        referencedRelation: "obituaries"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "family_relations_related_obituary_id_fkey"
                        columns: ["related_obituary_id"]
                        referencedRelation: "obituaries"
                        referencedColumns: ["id"]
                    }
                ]
            },
            flower_offerings: {
                Row: {
                    id: string
                    created_at: string
                    user_id: string
                    memorial_id: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    user_id: string
                    memorial_id: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    user_id?: string
                    memorial_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "flower_offerings_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "flower_offerings_memorial_id_fkey"
                        columns: ["memorial_id"]
                        referencedRelation: "obituaries"
                        referencedColumns: ["id"]
                    }
                ]
            }
        },
        user_favorites: {
            Row: {
                id: string
                created_at: string
                user_id: string
                article_id: string
            }
            Insert: {
                id?: string
                created_at?: string
                user_id: string
                article_id: string
            }
            Update: {
                id?: string
                created_at?: string
                user_id?: string
                article_id?: string
            }
            Relationships: [
                {
                    foreignKeyName: "user_favorites_user_id_fkey"
                    columns: ["user_id"]
                    referencedRelation: "users"
                    referencedColumns: ["id"]
                },
                {
                    foreignKeyName: "user_favorites_article_id_fkey"
                    columns: ["article_id"]
                    referencedRelation: "obituaries"
                    referencedColumns: ["id"]
                }
            ]
        },
        reading_history: {
            Row: {
                id: string
                created_at: string
                user_id: string
                obituary_id: string
                updated_at: string
            }
            Insert: {
                id?: string
                created_at?: string
                user_id: string
                obituary_id: string
                updated_at?: string
            }
            Update: {
                id?: string
                created_at?: string
                user_id?: string
                obituary_id?: string
                updated_at?: string
            }
            Relationships: [
                {
                    foreignKeyName: "reading_history_user_id_fkey"
                    columns: ["user_id"]
                    referencedRelation: "users"
                    referencedColumns: ["id"]
                },
                {
                    foreignKeyName: "reading_history_obituary_id_fkey"
                    columns: ["obituary_id"]
                    referencedRelation: "obituaries"
                    referencedColumns: ["id"]
                }
            ]
        }
    }
}
