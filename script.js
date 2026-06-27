// ===== PARTICLES SYSTEM =====
(function () {
  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let w, h;
  let mouseX = -1, mouseY = -1;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  // Track mouse for interactive particles
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

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
      this.baseOpacity = this.opacity;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse interaction - subtle push
      if (mouseX > 0 && mouseY > 0) {
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.x += (dx / dist) * force * 0.5;
          this.y += (dy / dist) * force * 0.5;
          this.opacity = Math.min(1, this.baseOpacity + force * 0.3);
        } else {
          this.opacity += (this.baseOpacity - this.opacity) * 0.05;
        }
      }

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
          ctx.strokeStyle = `rgba(34, 211, 238, ${0.06 * (1 - dist / 150)})`;
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
  let isOpen = false;

  toggle.addEventListener("click", () => {
    isOpen = !isOpen;
    toggle.classList.toggle("open", isOpen);

    if (isOpen) {
      menu.style.display = "flex";
      menu.offsetHeight;
      menu.classList.add("show");
    } else {
      menu.classList.remove("show");
      menu.addEventListener("transitionend", function handler() {
        if (!isOpen) menu.style.display = "none";
        menu.removeEventListener("transitionend", handler);
      });
    }
  });

  document.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", () => {
      isOpen = false;
      toggle.classList.remove("open");
      menu.classList.remove("show");
      menu.addEventListener("transitionend", function handler() {
        menu.style.display = "none";
        menu.removeEventListener("transitionend", handler);
      });
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

// ===== 3D TILT EFFECT FOR TEAM CARDS =====
(function () {
  const cards = document.querySelectorAll(".team-card");

  cards.forEach((card) => {
    const color = card.getAttribute("data-color") || "#22d3ee";
    const glowEl = card.querySelector(".team-card-glow");
    if (glowEl) {
      glowEl.style.background = `radial-gradient(circle, ${color}20, transparent 70%)`;
    }

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;

      // Dynamic glow position
      if (glowEl) {
        glowEl.style.left = `${x - rect.width * 0.4}px`;
        glowEl.style.top = `${y - rect.height * 0.3}px`;
        glowEl.style.transform = "none";
        glowEl.style.width = "80%";
        glowEl.style.height = "80%";
      }
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      if (glowEl) {
        glowEl.style.left = "";
        glowEl.style.top = "";
        glowEl.style.transform = "translateX(-50%)";
        glowEl.style.width = "";
        glowEl.style.height = "";
      }
    });
  });
})();

// ===== 3D TILT FOR FEATURE CARDS =====
(function () {
  const cards = document.querySelectorAll(".feature-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

      // Move the background glow
      const bg = card.querySelector(".feature-card-bg");
      if (bg) {
        bg.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(34, 211, 238, 0.08), transparent 60%)`;
        bg.style.opacity = "1";
      }
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      const bg = card.querySelector(".feature-card-bg");
      if (bg) {
        bg.style.opacity = "0";
      }
    });
  });
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
        '<span class="highlight">ibrahim/</span>  <span class="highlight">ahmed/</span>  <span class="highlight">batool/</span>  <span class="highlight">zain/</span>\n<span class="highlight">salma/</span>  <span class="highlight">youssef/</span>  <span class="highlight">rawaa/</span>',
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

      let charIndex = 0;

      function typeChar() {
        if (charIndex < currentCmd.cmd.length) {
          cmdSpan.textContent += currentCmd.cmd[charIndex];
          charIndex++;
          setTimeout(typeChar, 40 + Math.random() * 40);
        } else {
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
  if (aboutSection) aboutObserver.observe(aboutSection);
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

// ===== TEAM MODALS =====
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add("active");
    document.body.classList.add("modal-open");
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
  }
}

function closeModalOutside(event) {
  if (event.target === event.currentTarget) {
    event.target.classList.remove("active");
    document.body.classList.remove("modal-open");
  }
}

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-overlay.active").forEach((modal) => {
      modal.classList.remove("active");
    });
    document.body.classList.remove("modal-open");
  }
});
