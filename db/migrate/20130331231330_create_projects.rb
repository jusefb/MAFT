class CreateProjects < ActiveRecord::Migration
  def change
    create_table :projects do |t|
      t.string :title
      t.string :owner
      t.text :description
      t.date :end_date
      t.date :start_date
      t.timestamps
    end
  end
end
