var animationFrame = null;

$('.product-section').each(function() {
  $(this).find('.effect').appendTo(this);
});

$(window).on('scroll resize', function() {
  if (animationFrame === null) {
    animationFrame = requestAnimationFrame(function() {
      parallaxScroll();
      animationFrame = null;
    });
  }
});

function clamp(value) {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(value) {
  value = clamp(value);
  return value * value * (3 - 2 * value);
}

function parallaxScroll() {
  var scrolled = $(window).scrollTop();
  var windowHeight = $(window).height();
  var mobile = window.innerWidth <= 900;

  var reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  var layers = [
    [0.12, -0.08],
    [-0.18, -0.12],
    [0.25, -0.15],
    [-0.30, 0.10],
    [0.35, -0.20]
  ];

  $('.layer').each(function(index) {
    var x = reducedMotion ? 0 : scrolled * layers[index][0];
    var y = reducedMotion ? 0 : scrolled * layers[index][1];

    $(this).css('transform',
      'translate3d(' + x + 'px, ' + y + 'px, 0)'
    );
  });

  var heroY = reducedMotion ? 0 : scrolled * 0.30;

  $('.hero-text').css('transform',
    'translate(-50%, calc(-50% - ' + heroY + 'px))'
  );

  var circles = [
    [0.25, -0.15],
    [-0.30, 0.12],
    [0.18, -0.20]
  ];

  $('.floating-circle').each(function(index) {
    var x = reducedMotion ? 0 : scrolled * circles[index][0];
    var y = reducedMotion ? 0 : scrolled * circles[index][1];

    $(this).css('transform',
      'translate3d(' + x + 'px, ' + y + 'px, 0)'
    );
  });

  $('.product-section').each(function(index) {
    var section = $(this);
    var sectionTop = section.offset().top;
    var sectionHeight = section.outerHeight();

    var progress = clamp(
      (scrolled + windowHeight - sectionTop) /
      (windowHeight + sectionHeight)
    );
 
    var productProgress = smoothstep((progress - 0.05) / 0.35);

    var textProgress = smoothstep((progress - 0.20) / 0.22);

    var effectProgress1 = smoothstep((progress - 0.20) / 0.18);
    var effectProgress2 = smoothstep((progress - 0.24) / 0.18);

    if (reducedMotion) {
      productProgress = 1;
      textProgress = 1;
      effectProgress1 = 1;
      effectProgress2 = 1;
    }

    var direction = index === 1 ? -1 : 1;

    var visual = section.find('.product-visual');
    var image = section.find('.product-image');
    var circle = section.find('.product-circle');

    var startScale = mobile ? 1.18 : 1.55;

    var scale = startScale + (1 - startScale) * productProgress;

    var moveX = mobile ? 0 : -direction * 160 * (1 - productProgress);

    var moveY = -25 * (1 - productProgress);

    var floating = reducedMotion ? 0 : Math.sin(progress * Math.PI * 2) * 6;

    if (mobile) {
      visual.css('transform',
        'translate(-50%, -50%) ' +
        'translateY(' + moveY + 'px) ' +
        'scale(' + scale + ')'
      );
    } else {
      visual.css('transform',
        'translate3d(' + moveX + 'px, ' +
        moveY + 'px, 0) scale(' + scale + ')'
      );
    }

    image.css('transform',
      'translateY(' + floating + 'px)'
    );

    circle.css('transform',
      'scale(' + (0.9 + productProgress * 0.1) + ')'
    );

    var info = section.find('.product-info');

    var textItems = [
      { selector: '.step', delay: 0.00, distance: 25 },
      { selector: 'h2', delay: 0.05, distance: 35 },
      { selector: 'p', delay: 0.10, distance: 30 },
      { selector: '.product-detail', delay: 0.15, distance: 20 }
    ];

    textItems.forEach(function(item) {
      var p = reducedMotion ? 1 : smoothstep(
        (progress - 0.20 - item.delay) / 0.20
      );

      info.find(item.selector).css({
        opacity: p,
        transform:
          'translateY(' + ((1 - p) * item.distance) + 'px)'
      });
    });

    var effectOne = section.find('.effect-one');
    var effectTwo = section.find('.effect-two');

    if (!image.length || !effectOne.length || !effectTwo.length) {
      return;
    }
    
    var productRect = image[0].getBoundingClientRect();
    var sectionRect = section[0].getBoundingClientRect();

    var productLeft = productRect.left - sectionRect.left;
    var productRight = productRect.right - sectionRect.left;

    var productCenterY = productRect.top + productRect.height / 2 - sectionRect.top;

    var effectWidth1 = effectOne.outerWidth();
    var effectHeight1 = effectOne.outerHeight();

    var effectWidth2 = effectTwo.outerWidth();
    var effectHeight2 = effectTwo.outerHeight();

    var gap = -15;

    var targetX1 = productLeft - effectWidth1 - gap;
    var targetX2 = productRight + gap;

    var targetY1 = productCenterY - effectHeight1 / 2;
    var targetY2 = productCenterY - effectHeight2 / 2;
 
    var startX1 = targetX1 - 80;
    var startX2 = targetX2 + 80;

    var startY1 = targetY1 - 40;
    var startY2 = targetY2 + 40;

    var x1 = startX1 + (targetX1 - startX1) * effectProgress1;

    var y1 = startY1 + (targetY1 - startY1) * effectProgress1;

    var x2 = startX2 + (targetX2 - startX2) * effectProgress2;

    var y2 = startY2 + (targetY2 - startY2) * effectProgress2;

    var float1 = reducedMotion ? 0 :
      Math.sin(progress * Math.PI * 3) *
      8 * effectProgress1;

    var float2 = reducedMotion ? 0 :
      Math.sin(progress * Math.PI * 3 + 1.5) *
      8 * effectProgress2;

    effectOne.css({
      position: 'absolute',
      left: '0px',
      right: 'auto',
      top: '0px',
      bottom: 'auto',
      opacity: effectProgress1 * 0.9,
      transform:
        'translate3d(' +
        x1 + 'px, ' +
        (y1 + float1) + 'px, 0)'
    });

    effectTwo.css({
      position: 'absolute',
      left: '0px',
      right: 'auto',
      top: '0px',
      bottom: 'auto',
      opacity: effectProgress2 * 0.8,
      transform:
        'translate3d(' +
        x2 + 'px, ' +
        (y2 + float2) + 'px, 0) scaleX(-1)'
    });
  });
}

parallaxScroll();

$('#backToTop').on('click', function(e) {
  e.preventDefault();

  $('html, body').animate({
    scrollTop: 0
  }, 800);
});
