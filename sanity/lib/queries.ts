export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  heroTitle,
  heroSubtitle,
  about,
  email,
  github,
  linkedin
}`

export const experiencesQuery = `*[_type == "experience"] | order(startDate desc){
  role,
  company,
  location,
  startDate,
  endDate,
  highlights,
  tech
}`

export const projectsQuery = `*[_type == "project"] | order(featured desc, title asc){
  title,
  summary,
  techStack,
  github,
  featured
}`