class AddDeadlineToTask < ActiveRecord::Migration[5.0]
  def change
    add_column :tasks, :deadline, :date
  end
end
