class RemoveAttributeTypeId < ActiveRecord::Migration
  def change
    remove_column(:story_board_objects, :type_id)
  end
end
