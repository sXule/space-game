function Camera(engine)
{
    var center = new PIXI.Point(engine.renderer.view.width/2, engine.renderer.view.height/2);

    this.view = new PIXI.Container();
    this.view.alpha = 0;
    var fade_out = false;
    var fade_rate = 0.01;

    // Physics Variables
    var vx = 0;
    var vy = 0;

    var focus = {};
    var zoom = 1;

    var easing = 0.1;

    this.update = function()
    {
        // Fade in and out
        if ( !fade_out && this.view.alpha < 1 )
        {
            this.view.alpha += fade_rate;
            if ( this.view.alpha > 1 )
                { this.view.alpha = 1; }
        }
        else if ( fade_out && this.view.alpha > 0 )
            {
                this.view.alpha -= fade_rate;
                if ( this.view.alpha > 1 )
                    { this.view.alpha = 1; }
            }

        // Adjust Camera
        if ( typeof focus!='undefined' )
        {
            // Follow motion
            this.view.x -= focus.vx;
            this.view.y -= focus.vy;

            var g_focus = this.view.toGlobal(new PIXI.Point(focus.x,focus.y));
            var xdiff = center.x-g_focus.x;
            var ydiff = center.y-g_focus.y;
            var dist = Math.sqrt(xdiff*xdiff+ydiff*ydiff);
            var dir = Math.atan2(ydiff,xdiff);
            var vel = easing * dist;

            // Set Position
            this.view.x = this.view.x + vel*Math.cos(dir);
            this.view.y = this.view.y + vel*Math.sin(dir);

            // Set pivot
            //this.view.pivot.set(center);

            // Set Zoom
            if ( this.view.scale.x != zoom )
            {
                var z = easing * (zoom-this.view.scale);
                //this.view.scale.set(z,z);
            }
        }
    };

    this.cleanup = function()
    {
        this.view.destroy();
    };

    this.setFocus = function(f, z)
    {
        if ( typeof f['x'] == 'undefined' || typeof f['y'] == 'undefined' )
            { console.error('setFocus: position undefined'); }
        else
        {
            if ( typeof f['vx'] == 'undefined' )
                { f['vx'] = 0; }
            if ( typeof f['vy'] == 'undefined' )
                { f['vy'] = 0; }

            focus = f;
            zoom = (typeof z!='undefined')?z:zoom;
        }
    };

    this.getVelocity = function()
    {
        return {
            x: vx,
            y: vy
        };
    };
}
