import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectItem from '../ProjectItem'
import {
  MainBg,
  Nav,
  Logo,
  Select,
  Option,
  ContentDiv,
  LoaderDiv,
  FailureDiv,
  FailureImg,
  FailureHeading,
  FailurePara,
  Ul,
} from './styledComponents'

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
    selectOption: categoriesList[0].id,
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
    <LoaderDiv data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </LoaderDiv>
  )

  renderSuccessView = () => {
    const {projectData} = this.state
    return (
      <Ul>
        {projectData.map(eachProject => (
          <ProjectItem key={eachProject.id} projectDetails={eachProject} />
        ))}
      </Ul>
    )
  }

  renderFailureView = () => (
    <FailureDiv>
      <FailureImg
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <FailureHeading>Oops! Something Went Wrong</FailureHeading>
      <FailurePara>
        We cannot see to find the page you are looking for
      </FailurePara>
    </FailureDiv>
  )

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
      <MainBg>
        <Nav>
          <Logo
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </Nav>
        <ContentDiv>
          <Select value={selectOption} onChange={this.onSelect}>
            {categoriesList.map(eachOption => (
              <Option key={eachOption.id}>{eachOption.displayText}</Option>
            ))}
          </Select>
          {this.renderProjects()}
        </ContentDiv>
      </MainBg>
    )
  }
}

export default Projects
