export interface Userinfo {
    profile_picture?: string,
    first_name: string,
    last_name: string,
    email: string,
    username: string,
    bio: string,
    role: 'student'|'tutor',
    created_at: Date,
  };