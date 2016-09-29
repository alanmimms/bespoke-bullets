module.exports = function(options) {
  return function(deck) {
    var activeSlideIndex,
        activeBulletIndex,

        bullets = deck.slides.map(function(slide) {
          return [].slice.call(slide.querySelectorAll((typeof options === 'string' ? options : '[data-bespoke-bullet]')), 0);
        }),

        next = function() {
          var nextSlideIndex = activeSlideIndex + 1;

          if (activeSlideHasBulletByOffset(1)) {
            setActiveBullet(activeSlideIndex, activeBulletIndex + 1);
            return false;
          } else if (bullets[nextSlideIndex]) {
            setActiveBullet(nextSlideIndex, 0);
          }

          return true;
        },

        prev = function() {
          var prevSlideIndex = activeSlideIndex - 1;

          if (activeSlideHasBulletByOffset(-1)) {
            setActiveBullet(activeSlideIndex, activeBulletIndex - 1);
            return false;
          } else if (bullets[prevSlideIndex]) {
            setActiveBullet(prevSlideIndex, bullets[prevSlideIndex].length - 1);
          }

          return true;
        },

        activateBullet = function(slideIndex, bulletIndex) {
          activeSlideIndex = slideIndex;
          activeBulletIndex = bulletIndex;

          bullets.forEach(function(slide, s) {
            slide.forEach(function(bullet, b) {
              bullet.classList.add('bespoke-bullet');

              if (s < slideIndex || s === slideIndex && b <= bulletIndex) {
                bullet.classList.add('bespoke-bullet-active');
                bullet.classList.remove('bespoke-bullet-inactive');
              } else {
                bullet.classList.add('bespoke-bullet-inactive');
                bullet.classList.remove('bespoke-bullet-active');
              }

              if (s === slideIndex && b === bulletIndex) {
                bullet.classList.add('bespoke-bullet-current');
              } else {
                bullet.classList.remove('bespoke-bullet-current');
              }
            });
          });
        },

        setActiveBullet = function(slideIndex, bulletIndex) {
          deck.fire('slide+bullet', {
            slidePlusBullet: {slideIndex, bulletIndex}, 
            index: slideIndex, 
            slide: deck.slides[slideIndex],
          });
        },

        activeSlideHasBulletByOffset = function(offset) {
          return bullets[activeSlideIndex][activeBulletIndex + offset] !== undefined;
        };

    deck.on('next', next);
    deck.on('prev', prev);

    deck.on('slide', function(e) {
      activateBullet(e.index, 0);
    });

    deck.on('slide+bullet', function(e) {
      activateBullet(e.slidePlusBullet.slideIndex, e.slidePlusBullet.bulletIndex);
    });

    activateBullet(0, 0);
  };
};
