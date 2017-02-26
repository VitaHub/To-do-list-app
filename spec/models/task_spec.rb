require 'rails_helper'

RSpec.describe Task, type: :model do
  it "should be created" do
    create(:task)
    expect(Task.count).to eq(1)
  end

  describe "ActiveModel validations" do
    let(:task) { create(:task) }

    it { expect(task).to validate_presence_of(:name) }
    it { expect(task).to validate_presence_of(:project_id) }
  end

  describe "ActiveRecord associations" do
    let(:task) { create(:task) }

    it { expect(task).to belong_to(:project) }
  end
end