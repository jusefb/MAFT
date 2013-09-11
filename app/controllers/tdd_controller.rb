class TddController < ApplicationController
  skip_before_filter :authenticate_user!

  def index

  end

  def view_tdd_process

  end

  def render_svg_image
    response.headers['Content-Type'] = 'image/svg+xml'
    render :text => open('app/assets/images/tdd_process.svg').read
  end

  def vew_app_tests

  end

  def render_ruby_tests
    #response.headers['Content-Type'] = 'text/html'
    #render file: 'app/views/tdd/ruby_test', layout: false, format: 'html'
    render layout: false
  end

  def render_js_tests
    #response.headers['Content-Type'] = 'text/html'
    #render file: 'app/views/tdd/js_tests.html', layout: false, format: 'html'
    render layout: false
  end

end
