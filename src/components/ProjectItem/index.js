import {Li, ProjectImg, ProjectName} from './styledComponents'

const ProjectItem = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails
  return (
    <Li>
      <ProjectImg src={imageUrl} alt={name} />
      <ProjectName>{name}</ProjectName>
    </Li>
  )
}

export default ProjectItem
