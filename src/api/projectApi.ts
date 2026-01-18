import type { IProject } from "@/interfaces/project";

class ProjectApi {
  provider: Storage;

  constructor() {
    this.provider = localStorage;
  }

  async saveProject(project: IProject): Promise<IProject[]> {
    try {
      const projects = await this.getProjects();
      projects.push(project);
      this.provider.setItem('projects', JSON.stringify(projects));
      return projects;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getProjects(): Promise<IProject[]> {
    try {
      const projectsData = this.provider.getItem('projects');
      return projectsData ? JSON.parse(projectsData) : [];
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getProjectById(projectId: string): Promise<IProject | null> {
    try {
      const projects = await this.getProjects();
      const project = projects.find(p => p.id === projectId) || null;
      return project;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateProject(updatedProject: IProject): Promise<IProject> {
    try {
      const projects = await this.getProjects();
      const index = projects.findIndex(p => p.id === updatedProject.id);
      if (index !== -1) {
        projects[index] = updatedProject;
        this.provider.setItem('projects', JSON.stringify(projects));
      }
  
      return updatedProject;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteProject(projectId: string): Promise<IProject[]> {
    try {
      const projects = await this.getProjects();
      const filteredProjects = projects.filter(p => p.id !== projectId);
      this.provider.setItem('projects', JSON.stringify(filteredProjects));
      return filteredProjects;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default new ProjectApi();