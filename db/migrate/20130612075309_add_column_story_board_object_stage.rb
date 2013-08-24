class AddColumnStoryBoardObjectStage < ActiveRecord::Migration
  def change
    add_column :story_board_objects, :stage, :string
  end
end