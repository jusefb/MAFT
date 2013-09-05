class ReportingController < ApplicationController
  def index
    @projects = []
    projects = Project.all()
    projects.each do |p|
      @projects.push([p.title, p.id])
    end

    render :index
  end

  def get_report_data
    #parameters = ["'Current'", params[:start_date], params[:end_date]]
    plot_data = []

    @date1 = Date.parse(params[:start_date])
    @date2 = Date.parse(params[:end_date])
    @date_period = (@date1..@date2).to_a
    sprint_date_clause = 'marked_as_current_date >= ? and marked_as_current_date <= ?'

    @date_period.each do |d|
      i = @date_period.index(d) + 1
      total_n_of_hrs = 0
      number_of_hrs_for_done_tasks = 0

      #get all the current sprint tasks created before date in question
      current_sprint_tasks = StoryBoardObject.where('stage = ? and created_at <= ? and estimated_time is not null','Current', d).where(sprint_date_clause, @date1, @date2)
      number_of_hrs_for_sprint = current_sprint_tasks.select(:estimated_time).map(&:estimated_time).sum

      #get all the done tasks created before date i question
      done_tasks = StoryBoardObject.where('stage = ? and end_date >= ? and end_date <= ? and estimated_time is not null and created_at <= ?','Done', @date1, @date2, d).where(sprint_date_clause, @date1, @date1)
      done_tasks_hrs = done_tasks.select(:estimated_time).map(&:estimated_time).sum

      #sum to get total hours in sprint backlog till date in question
      number_of_hrs_for_sprint += done_tasks_hrs

      #get all the tasks completed during the previous day
      tasks = StoryBoardObject.where('stage = ? and end_date < ? and end_date >= ? and estimated_time is not null', 'Done', d, d - i.day).where(sprint_date_clause, @date1, @date2)
       number_of_hrs_for_done_tasks = tasks.select(:estimated_time).map(&:estimated_time).sum if(tasks.count > 0)
       total_n_of_hrs =  number_of_hrs_for_sprint - number_of_hrs_for_done_tasks
       plot_data.push(total_n_of_hrs)
    end

    #('stage = ? and marked_as_current_date >= ? and marked_as_current_date <= ?', parameters)

    render json: {reportData: [plot_data], numberTicks: @date_period.length}
  end
end
