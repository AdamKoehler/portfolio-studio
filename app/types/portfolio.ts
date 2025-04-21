import { ProjectType } from '@/app/dashboard/update/page'

export type Portfolio = {
  aboutMe: string | null
  theme: string
  github: string | null
  linkedin: string | null
  projects: ProjectType[]
  owner: {
    image: string | null
    name: string
  }
  ownerUsername: string | null
} 