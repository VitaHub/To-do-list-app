class Task < ApplicationRecord
  belongs_to :project
  acts_as_list scope: :project
  validates :name, :project_id, presence: true
end
