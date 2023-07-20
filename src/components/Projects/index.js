import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectItem from '../ProjectItem'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Projects extends Component {
  state = {
    projectData: [],
    apiStatus: apiConstants.initial,
    selectOption: 'ALL',
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const {selectOption} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${selectOption}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))
      this.setState({projectData: updatedData, apiStatus: apiConstants.success})
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderInProgressView = () => (
    <div className="loader-div" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => {
    const {projectData} = this.state
    return (
      <ul>
        {projectData.map(eachProject => (
          <ProjectItem key={eachProject.id} projectDetails={eachProject} />
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="failure-div">
      <img
        className="failure-img"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-head">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  onRetry = () => {
    this.getProjects()
  }

  renderProjects = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.inProgress:
        return this.renderInProgressView()
      case apiConstants.success:
        return this.renderSuccessView()
      case apiConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  onSelect = event => {
    this.setState({selectOption: event.target.value}, this.getProjects)
  }

  render() {
    const {selectOption} = this.state
    return (
      <div className="main-bg">
        <nav>
          <img
            className="logo"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </nav>
        <div className="content-div">
          <select value={selectOption} onChange={this.onSelect}>
            {categoriesList.map(eachOption => (
              <option value={eachOption.id} key={eachOption.id}>
                {eachOption.displayText}
              </option>
            ))}
          </select>
          {this.renderProjects()}
        </div>
      </div>
    )
  }
}

export default Projects
