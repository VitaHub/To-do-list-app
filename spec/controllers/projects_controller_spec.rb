require 'rails_helper'

RSpec.describe ProjectsController, type: :controller do
  let(:user) { create(:user) }

  before(:each) { sign_in user }

  let(:own_project) {
    FactoryGirl.build(:project, user: user).attributes
  }  

  let(:invalid_project) {
    FactoryGirl.build(:project, user: user, name: "").attributes
  }

  let(:other_project) {
    FactoryGirl.build(:project).attributes
  }

  describe "GET #index" do
    it "assigns only own projects as @projects" do
      project = Project.create! own_project
      Project.create! other_project
      get :index
      expect(response).to be_success
      expect(assigns(:projects)).to eq([project])
    end
  end

  describe "GET #show" do
    it "assigns the requested project as @project" do
      project = Project.create! own_project
      get :show, params: {id: project.to_param}
      expect(response).to be_success
      expect(assigns(:project)).to eq(project)
    end

    it "fails if project is not own" do
      project = Project.create! other_project
      expect {
        get :show, params: {id: project.to_param}
      }.to raise_error(SecurityError, "Invalid user!")
    end
  end

  describe "POST #create" do
    context "with valid params" do
      it "creates a new Project" do
        expect {
          post :create, params: {project: own_project}
        }.to change(Project, :count).by(1)
      end

      it "assigns a newly created project as @project" do
        post :create, params: {project: own_project}
        expect(assigns(:project)).to be_a(Project)
        expect(assigns(:project)).to be_persisted
      end
    end

    context "with invalid params" do
      it "does not create a new Project" do
        expect {
          post :create, params: {project: invalid_project}
        }.to change(Project, :count).by(0)
      end
    end
  end

  describe "PUT #update" do
    let(:new_project) {
      FactoryGirl.build(:project, user: user, 
        name: "Another New Project").attributes
    }

    context "with valid params" do
      it "updates the requested project" do
        project = Project.create! own_project
        put :update, params: {id: project.to_param, 
          project: new_project}
        expect(response).to be_success
        project.reload
        expect(assigns(:project).name).to eq("Another New Project")
      end

      it "fails if project is not own" do
        project = Project.create! other_project
        expect {
          put :update, params: {id: project.to_param, 
            project: new_project}
        }.to raise_error(SecurityError, "Invalid user!")
      end
    end

    context "with invalid params" do
      it "does not update the requested project" do
        project = Project.create! own_project
        put :update, params: {id: project.to_param, 
          project: invalid_project}
        expect(assigns(:project).name).to eq("")
        expect(project.name).to match(/project/)
      end      
    end
  end

  describe "DELETE #destroy" do
    it "destroys the requested project" do
      project = Project.create! own_project
      expect {
        delete :destroy, params: {id: project.to_param}
      }.to change(Project, :count).by(-1)
    end

    it "does not destroy the requested project if user invalid" do
      project = Project.create! other_project
      expect {
        delete :destroy, params: {id: project.to_param}
      }.to raise_error(SecurityError, "Invalid user!")
      expect(Project.count).to eq(1)
    end
  end
end