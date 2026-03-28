const teamData = {
  leadership: {
    title: "قسم القيادة",
    color: "bg-amber-400",
    members: [
      { name: "إبراهيم", role: "قائد ومدير عام + قسم الشباب" },
      { name: "أريام", role: "قائدة قسم البنات" },
      { name: "سلمى", role: "قائدة قسم البنات" }
    ]
  },
  research: {
    title: "قسم البحث والتخطيط",
    color: "bg-cyan-400",
    members: [
      { name: "بتول", role: "رئيسة القسم" },
      { name: "طارق", role: "عضو" },
      { name: "بهاء", role: "عضو" },
      { name: "ريتاج", role: "عضو" },
      { name: "مرح", role: "عضو" },
      { name: "أحمد", role: "عضو" }
    ]
  },
  production: {
    title: "قسم التلخيص والإخراج",
    color: "bg-emerald-400",
    members: [
      { name: "سلمى", role: "رئيسة القسم" },
      { name: "أريام", role: "عضو" },
      { name: "هبة", role: "عضو" },
      { name: "أصيل", role: "عضو" },
      { name: "تقوى", role: "عضو" },
      { name: "يوسف", role: "عضو" }
    ]
  },
  design: {
    title: "قسم التصميم",
    color: "bg-purple-400",
    members: [
      { name: "زين", role: "رئيسة القسم" },
      { name: "روعة", role: "عضو" },
      { name: "سلمى", role: "عضو" },
      { name: "أريام", role: "عضو" }
    ]
  },
  tech: {
    title: "القسم التقني",
    color: "bg-blue-400",
    members: [
      { name: "أحمد", role: "رئيس القسم" },
      { name: "عمر", role: "عضو" },
      { name: "إبراهيم", role: "عضو" }
    ]
  }
};

function openTeamModal(deptKey) {
  const dept = teamData[deptKey];
  const modal = document.getElementById('teamModal');
  const title = document.getElementById('modalTitle');
  const content = document.getElementById('modalContent');
  const gradient = document.getElementById('modalGradient');

  title.innerText = dept.title;
  gradient.className = `h-2 w-full ${dept.color}`;
  
  content.innerHTML = dept.members.map(member => `
    <div class="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
      <span class="font-bold text-slate-100">${member.name}</span>
      <span class="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-md">${member.role}</span>
    </div>
  `).join('');

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  setTimeout(() => {
    modal.querySelector('div').classList.add('scale-100', 'opacity-100');
  }, 10);
}

function closeTeamModal() {
  const modal = document.getElementById('teamModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// Close on click outside
window.onclick = function(event) {
  const modal = document.getElementById('teamModal');
  if (event.target == modal) closeTeamModal();
}