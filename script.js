// ===== PARTICLES SYSTEM =====
(function () {
  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > w) this.speedX *= -1;
      if (this.y < 0 || this.y > h) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34, 211, 238, ${this.opacity})`;
      ctx.fill();
    }
  }

  const count = Math.min(80, Math.floor((w * h) / 15000));
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(34, 211, 238, ${0.05 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();
})();

// ===== HEADER SCROLL EFFECT =====
(function () {
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
})();

// ===== MOBILE MENU =====
(function () {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
    if (menu.classList.contains("show")) {
      menu.classList.remove("show");
      setTimeout(() => (menu.style.display = "none"), 300);
    } else {
      menu.style.display = "flex";
      requestAnimationFrame(() => menu.classList.add("show"));
    }
  });

  document.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.classList.remove("open");
      menu.classList.remove("show");
      setTimeout(() => (menu.style.display = "none"), 300);
    });
  });
})();

// ===== ACTIVE NAV LINK ON SCROLL =====
(function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link, .mobile-link");

  function setActiveLink() {
    const scrollY = window.scrollY + 200;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("data-section") === id) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", setActiveLink);
  setActiveLink();
})();

// ===== SCROLL REVEAL ANIMATIONS =====
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute("data-delay") || 0;
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, parseInt(delay));
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
  );

  document
    .querySelectorAll(".feature-card, .timeline-item, .team-card")
    .forEach((el) => observer.observe(el));
})();

// ===== COUNTER ANIMATION =====
(function () {
  const counters = document.querySelectorAll(".stat-number");
  let animated = false;

  function animateCounters() {
    if (animated) return;

    const statsSection = document.querySelector(".hero-stats");
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      animated = true;

      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-target"));
        const duration = 2000;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.floor(target * eased);

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            counter.textContent = target;
          }
        }

        requestAnimationFrame(update);
      });
    }
  }

  window.addEventListener("scroll", animateCounters);
  animateCounters();
})();

// ===== TERMINAL TYPING EFFECT =====
(function () {
  const commands = [
    {
      cmd: "whoami",
      output: '<span class="highlight">root</span>@ahu-team',
    },
    {
      cmd: "cat /etc/mission",
      output: '<span class="success">[+]</span> Helping AHU students learn cybersecurity',
    },
    {
      cmd: "ls /team/members",
      output:
        '<span class="highlight">ibrahim/</span>  <span class="highlight">ahmed/</span>  <span class="highlight">iryam/</span>  <span class="highlight">batool/</span>\n<span class="highlight">tarek/</span>    <span class="highlight">bahaa/</span>  <span class="highlight">rawaa/</span>  <span class="highlight">zain/</span>',
    },
    {
      cmd: "cat /roadmap/progress.log",
      output:
        '<span class="success">[+]</span> Network+    ........... READY\n<span class="success">[+]</span> Security+   ........... READY\n<span class="success">[+]</span> Linux       ........... READY\n<span class="success">[+]</span> Python      ........... READY\n<span class="success">[+]</span> Cybersec    ........... READY',
    },
    {
      cmd: "./welcome.sh --university AHU",
      output:
        '<span class="success">[+]</span> Al-Hussein Bin Talal University\n<span class="success">[+]</span> ROOT TEAM initialized\n<span class="success">[+]</span> Ready to help students!',
    },
  ];

  const bodyEl = document.getElementById("terminal-body");
  let hasStarted = false;

  function runTerminal() {
    let cmdIndex = 0;

    function processCommand() {
      if (cmdIndex >= commands.length) {
        setTimeout(() => {
          bodyEl.innerHTML = "";
          cmdIndex = 0;
          processCommand();
        }, 3000);
        return;
      }

      const currentCmd = commands[cmdIndex];

      // Create new line
      const newLine = document.createElement("div");
      newLine.className = "terminal-line";
      if (cmdIndex > 0) newLine.style.marginTop = "0.75rem";

      const prompt = document.createElement("span");
      prompt.className = "terminal-prompt";
      prompt.textContent = "$ ";

      const cmdSpan = document.createElement("span");
      cmdSpan.className = "terminal-cmd";

      const cursor = document.createElement("span");
      cursor.className = "terminal-cursor";
      cursor.textContent = "|";

      newLine.appendChild(prompt);
      newLine.appendChild(cmdSpan);
      newLine.appendChild(cursor);
      bodyEl.appendChild(newLine);
      bodyEl.scrollTop = bodyEl.scrollHeight;

      // Type command character by character
      let charIndex = 0;

      function typeChar() {
        if (charIndex < currentCmd.cmd.length) {
          cmdSpan.textContent += currentCmd.cmd[charIndex];
          charIndex++;
          setTimeout(typeChar, 40 + Math.random() * 40);
        } else {
          // Remove cursor, show output
          cursor.remove();

          setTimeout(() => {
            const outputDiv = document.createElement("div");
            outputDiv.className = "terminal-output";
            outputDiv.innerHTML = currentCmd.output;
            bodyEl.appendChild(outputDiv);
            bodyEl.scrollTop = bodyEl.scrollHeight;

            cmdIndex++;
            setTimeout(processCommand, 600);
          }, 400);
        }
      }

      setTimeout(typeChar, 300);
    }

    processCommand();
  }

  // Start typing when about section is visible
  const aboutObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasStarted) {
          hasStarted = true;
          runTerminal();
        }
      });
    },
    { threshold: 0.2 }
  );

  const aboutSection = document.getElementById("about");
  if (aboutSection) {
    aboutObserver.observe(aboutSection);
  }
})();

// ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
