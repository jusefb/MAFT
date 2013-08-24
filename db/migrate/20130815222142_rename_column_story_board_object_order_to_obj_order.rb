class RenameColumnStoryBoardObjectOrderToObjOrder < ActiveRecord::Migration
  def change
    rename_column :story_board_objects, :order, :obj_order
  end
end
