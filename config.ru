use Rack::Static,
  :urls => ["/Stimuli", "/js", "/css"],
  :root => "public_html"

run lambda { |env|
  [
    200,
    {
      'Content-Type'  => 'text/html',
      'Cache-Control' => 'max-age=86400'
    },
    File.open('public_html/index.html', File::RDONLY)
  ]
}
