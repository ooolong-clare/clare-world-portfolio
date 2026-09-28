/** Vite replaces BASE_URL for local/root and GitHub project-site builds. */
export const asset=(path:string)=>`${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
