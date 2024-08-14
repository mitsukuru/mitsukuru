class API::V1::ProjectsController < ApplicationController
  def create
    @project = Project.new(project_params)
    if @project.save
      render json: @project, status: :created
    else
      render json: @project.errors, status: :unprocessable_entity
    end
  end

  def analyze
    @project = Project.find(params[:id])
    analysis_result = PortfolioAnalysisService.new(@project).perform
    render json: analysis_result
  end

  private

  def project_params
    params.require(:project).permit(:url, :description, :technologies)
  end
end
