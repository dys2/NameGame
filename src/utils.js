export type TeamObject = {
  id: string,
  type: string,
  slug: string,
  jobTitle: string,
  firstName: string,
  lastName: string,
  socialLinks: Array<string>,
  headshot: {
    type: string,
    mimeType: string,
    id: string,
    url: string,
    alt: string,
    height: number,
    width: number
  }
};