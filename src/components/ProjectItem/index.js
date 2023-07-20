import './index.css'

const ProjectItem = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails
  return (
    <li className="list-item">
      <img className="project-img" src={imageUrl} alt={name} />
      <p className="project-name">{name}</p>
    </li>
  )
}

export default ProjectItem
