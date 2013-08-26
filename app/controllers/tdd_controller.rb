class TddController < ApplicationController
  skip_before_filter :index

  def index

  end

  def view_tdd_process

  end

  def render_svg_image
    response.headers['Content-Type'] = 'image/svg+xml'
    render :text => open('app/assets/images/tdd_process.svg').read
  end

end
