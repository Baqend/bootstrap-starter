var app = 'toodle';
DB.connect(app);

DB.ready(function() {
    $('#hello').html('Connected to Baqend app <strong>' + app + "</strong>");
});
