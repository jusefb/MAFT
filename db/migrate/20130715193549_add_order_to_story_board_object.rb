class AddOrderToStoryBoardObject < ActiveRecord::Migration
  def change
    add_column :story_board_objects, :order, :integer
  end
end
