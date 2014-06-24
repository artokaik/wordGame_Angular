use Rack::Static,
  :urls => ["/Stimuli", "/js", "/css"],
  :root => "AuditoryDisturbanceTest"

run lambda { |env|
  [
    200,
    {
      'Content-Type'  => 'text/html',
      'Cache-Control' => 'max-age=86400'
    },
    File.open('AuditoryDisturbanceTest/index.html', File::RDONLY)
  ]
}
