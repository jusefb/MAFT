class CreateStoryBoardObjects < ActiveRecord::Migration
  def change
    create_table :story_board_objects do |t|
      t.string :title
      t.text :description
      t.string :type
      t.integer :type_id
      t.timestamps
    end
  end
end
