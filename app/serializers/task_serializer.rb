class TaskSerializer < ActiveModel::Serializer
  attributes :id, :name, :done, :position, :deadline
end
