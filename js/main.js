/* ==========================================================================
   ELETROTEC SOLUÇÕES ELÉTRICAS — MOTOR INTERATIVO & ACESSIBILIDADE
   Direção: Engenharia de Confiança
   Conformidade: WCAG AA, WAI-ARIA Tabs, Focus Trap, Pré-Análise Comercial
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initSegmentTabs();
  initCommercialPreAnalysis();
  initProjectFilters();
  initMobileMenu();
  initHeroInteractiveGrid();
  initScrollSpy();
  initScrollReveal();
  initCountUp();
  initParallax();
  initProjectLightbox();
  initFaqAccordion();
  initSpotlightHover();
});

/* --- 1. ABAS "PARA QUEM É" COM ACESSIBILIDADE COMPLETA (WAI-ARIA TABS) --- */
function initSegmentTabs() {
  const tabList = document.querySelector('[role="tablist"]');
  const tabBtns = document.querySelectorAll('.segment-tab-btn');
  const panels = document.querySelectorAll('.segment-panel');

  if (!tabList || !tabBtns.length || !panels.length) return;

  function activateTab(btn, focus = true) {
    const targetId = btn.getAttribute('aria-controls');

    // Desativa todas as abas
    tabBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
      b.setAttribute('tabindex', '-1');
    });

    // Ativa aba selecionada
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    btn.setAttribute('tabindex', '0');
    if (focus) btn.focus();

    // Alterna painéis
    panels.forEach(panel => {
      if (panel.id === targetId) {
        panel.classList.add('active');
        panel.removeAttribute('hidden');
        panel.setAttribute('tabindex', '0');
      } else {
        panel.classList.remove('active');
        panel.setAttribute('hidden', 'true');
        panel.setAttribute('tabindex', '-1');
      }
    });
  }

  tabBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      activateTab(btn, false);
    });

    // Navegação por teclado: Setas Direita/Esquerda/Cima/Baixo, Home, End
    btn.addEventListener('keydown', (e) => {
      let targetIndex = index;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        targetIndex = (index + 1) % tabBtns.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        targetIndex = (index - 1 + tabBtns.length) % tabBtns.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        targetIndex = tabBtns.length - 1;
      } else {
        return;
      }
      activateTab(tabBtns[targetIndex], true);
    });
  });
}

/* --- 2. PRÉ-ANÁLISE COMERCIAL INTERATIVA COM RANGE SLIDER (2.1) --- */
function initCommercialPreAnalysis() {
  const catBtns = document.querySelectorAll('.pre-cat-btn');
  const catInput = document.getElementById('preCategoria');
  const sliderConta = document.getElementById('preValorSlider');
  const sliderBadge = document.getElementById('sliderValueBadge');
  const tipoSelect = document.getElementById('preTipoImovel');
  const cidadeSelect = document.getElementById('preCidade');
  const obsInput = document.getElementById('preObservacao');
  
  const resCat = document.getElementById('resPerfilCat');
  const resFaixa = document.getElementById('resPerfilFaixa');
  const resEconomia = document.getElementById('resEconomiaAnual');
  const resCidade = document.getElementById('resPerfilCidade');
  const ctaBtn = document.getElementById('preCtaWhatsapp');

  if (!catBtns.length || !ctaBtn) return;

  const opcoesPorCategoria = {
    residencial: {
      labelValor: 'Valor Médio da Conta Mensal',
      min: 250,
      max: 6000,
      step: 50,
      defaultVal: 1200,
      labelTipo: 'Tipo de Residência / Necessidade',
      tipos: [
        { val: 'casa_padrao', text: 'Casa térrea / Telhado colonial ou cerâmico' },
        { val: 'casa_laje', text: 'Casa térrea com laje plana / Platibanda' },
        { val: 'sobrado', text: 'Sobrado / Edificação de 2 ou mais andares' },
        { val: 'seguranca_revisao', text: 'Câmeras / Cerca / Revisão de padrão' },
        { val: 'outro', text: 'Outro perfil residencial' }
      ]
    },
    rural: {
      labelValor: 'Custo Médio Mensal com Energia ou Diesel',
      min: 500,
      max: 12000,
      step: 100,
      defaultVal: 2000,
      labelTipo: 'Finalidade Principal no Campo',
      tipos: [
        { val: 'poco_artesiano', text: 'Bombeamento de Poço Artesiano' },
        { val: 'cisterna_acude', text: 'Bombeamento de Cisterna / Açude' },
        { val: 'irrigacao', text: 'Irrigação / Lavoura' },
        { val: 'energia_isolada', text: 'Energia para sede / área afastada (Off-grid)' },
        { val: 'starlink', text: 'Instalação de Antena Starlink' }
      ]
    },
    comercial: {
      labelValor: 'Consumo Médio Comercial Mensal',
      min: 800,
      max: 15000,
      step: 200,
      defaultVal: 3500,
      labelTipo: 'Ramo de Atuação / Instalação',
      tipos: [
        { val: 'comercio_geral', text: 'Comércio / Supermercado / Loja' },
        { val: 'oficina_galpao', text: 'Oficina / Galpão / Frigorífico' },
        { val: 'padrao_trifasico', text: 'Novo padrão trifásico de entrada' },
        { val: 'revisao_seguranca', text: 'Quadros de proteção e segurança' }
      ]
    }
  };

  let currentCategory = 'residencial';

  function renderCategoryOptions(cat) {
    const data = opcoesPorCategoria[cat];
    const valorLabelEl = document.getElementById('labelFaixaValor');
    const tipoLabelEl = document.getElementById('labelTipoImovel');

    if (valorLabelEl) valorLabelEl.textContent = data.labelValor;
    if (tipoLabelEl) tipoLabelEl.textContent = data.labelTipo;

    if (sliderConta) {
      sliderConta.min = data.min;
      sliderConta.max = data.max;
      sliderConta.step = data.step;
      sliderConta.value = data.defaultVal;
    }

    if (tipoSelect) {
      tipoSelect.innerHTML = data.tipos.map(t => `<option value="${t.text}">${t.text}</option>`).join('');
    }
  }

  function updatePreAnalysis() {
    const catNome = currentCategory === 'residencial' ? 'Residencial' : (currentCategory === 'rural' ? 'Propriedade Rural' : 'Comercial / Empresa');
    const valorNum = sliderConta ? parseInt(sliderConta.value, 10) : 1200;
    const valorFormatado = `R$ ${valorNum.toLocaleString('pt-BR')} / mês`;
    
    // Estimativa de economia anual (potencial de até 95% na fatura)
    const economiaAnualNum = Math.round(valorNum * 12 * 0.95);
    const economiaFormatada = `até R$ ${economiaAnualNum.toLocaleString('pt-BR')} / ano*`;

    const tipoText = tipoSelect ? tipoSelect.value : '';
    const cidadeText = cidadeSelect ? cidadeSelect.value : 'Taiobeiras e região';
    const obsText = obsInput && obsInput.value.trim() ? obsInput.value.trim() : 'Sem observações adicionais';

    if (sliderBadge) sliderBadge.textContent = valorFormatado;
    if (resCat) resCat.textContent = catNome;
    if (resFaixa) resFaixa.textContent = valorFormatado;
    if (resEconomia) resEconomia.textContent = economiaFormatada;
    if (resCidade) resCidade.textContent = cidadeText;

    // Atualiza preenchimento visual da trilha do slider
    if (sliderConta) {
      const min = parseFloat(sliderConta.min);
      const max = parseFloat(sliderConta.max);
      const val = parseFloat(sliderConta.value);
      const percentage = ((val - min) / (max - min)) * 100;
      sliderConta.style.background = `linear-gradient(to right, var(--color-electric-blue) 0%, var(--color-cyan-glow) ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`;
    }

    // Gera mensagem estruturada para WhatsApp
    const msg = [
      `Olá! Preenchi a simulação no site da Eletrotec e gostaria de uma avaliação técnica:`,
      `• Categoria: ${catNome}`,
      `• Conta / Custo Mensal: ${valorFormatado}`,
      `• Economia Anual Estimada: ${economiaFormatada}`,
      `• Tipo de Imóvel / Demanda: ${tipoText}`,
      `• Município/Localidade: ${cidadeText}`,
      `• Observações: ${obsText}`,
      ``,
      `Gostaria de agendar uma avaliação técnica e entender as condições.`
    ].join('\n');

    const waUrl = `https://wa.me/5538992115723?text=${encodeURIComponent(msg)}`;
    ctaBtn.setAttribute('href', waUrl);
  }

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      
      currentCategory = btn.getAttribute('data-category');
      if (catInput) catInput.value = currentCategory;

      renderCategoryOptions(currentCategory);
      updatePreAnalysis();
    });
  });

  if (sliderConta) sliderConta.addEventListener('input', updatePreAnalysis);
  if (tipoSelect) tipoSelect.addEventListener('change', updatePreAnalysis);
  if (cidadeSelect) cidadeSelect.addEventListener('change', updatePreAnalysis);
  if (obsInput) obsInput.addEventListener('input', updatePreAnalysis);

  // Inicializa com residencial
  renderCategoryOptions('residencial');
  updatePreAnalysis();
}

/* --- 3. FILTRO DE APLICAÇÕES E PROJETOS COM TRANSIÇÃO FLUIDA (3.4) --- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('is-hidden');
          card.removeAttribute('hidden');
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (card.style.opacity === '0') {
              card.classList.add('is-hidden');
              card.setAttribute('hidden', 'true');
            }
          }, 300);
        }
      });
    });
  });
}

/* --- 4. QUADRICULADO INTERATIVO COM ONDAS E DESCARGAS ELÉTRICAS (HERO GRID) --- */
function debounce(fn, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

function initHeroInteractiveGrid() {
  const canvas = document.getElementById('heroGridCanvas');
  const heroSection = document.getElementById('inicio');
  if (!canvas || !heroSection) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;
  let animationFrameId = null;
  let isVisible = true;

  // Parâmetros da malha
  const SPACING = 46;
  let cols = 0;
  let rows = 0;
  let points = [];

  // Estado do cursor
  const mouse = {
    x: -9999,
    y: -9999,
    active: false,
    hovered: false,
    speed: 0
  };

  // Efeitos de alta tensão (Raios e Faíscas)
  const lightningArcs = [];
  const sparks = [];
  let lastLightningTime = 0;
  let lastPulseTime = 0;

  function resize() {
    const rect = heroSection.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    buildGrid();
  }

  function buildGrid() {
    const isMobile = width < 768;
    const currentSpacing = isMobile ? 68 : SPACING;
    cols = Math.ceil(width / currentSpacing) + 2;
    rows = Math.ceil(height / currentSpacing) + 2;
    points = [];

    const offsetX = (width - (cols - 1) * currentSpacing) / 2;
    const offsetY = (height - (rows - 1) * currentSpacing) / 2;

    for (let r = 0; r < rows; r++) {
      points[r] = [];
      for (let c = 0; c < cols; c++) {
        const ox = offsetX + c * SPACING;
        const oy = offsetY + r * SPACING;
        points[r][c] = {
          originX: ox,
          originY: oy,
          x: ox,
          y: oy,
          vx: 0,
          vy: 0,
          energy: 0
        };
      }
    }
  }

  // Interação do mouse com a seção Hero
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const nx = e.clientX - rect.left;
    const ny = e.clientY - rect.top;

    if (mouse.active) {
      const dx = nx - mouse.x;
      const dy = ny - mouse.y;
      mouse.speed = Math.hypot(dx, dy);
    } else {
      mouse.speed = 1;
    }

    mouse.x = nx;
    mouse.y = ny;
    mouse.active = true;
    mouse.hovered = true;

    // Dispara descargas elétricas ao movimentar o mouse com mais velocidade
    const now = performance.now();
    if (mouse.speed > 6 && now - lastLightningTime > 80) {
      triggerLightning(mouse.x, mouse.y);
      lastLightningTime = now;
    }
  });

  heroSection.addEventListener('mouseenter', () => {
    mouse.hovered = true;
    mouse.active = true;
  });

  heroSection.addEventListener('mouseleave', () => {
    mouse.hovered = false;
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  });

  heroSection.addEventListener('click', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    triggerPulseShockwave(cx, cy);
    for (let i = 0; i < 3; i++) {
      setTimeout(() => triggerLightning(cx, cy), i * 60);
    }
  });

  function triggerPulseShockwave(cx, cy) {
    const maxDist = 260;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const p = points[r][c];
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < maxDist && dist > 1) {
          const force = (1 - dist / maxDist) * 16;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
          p.energy = Math.min(1, p.energy + 0.9);
        }
      }
    }
    // Emite faíscas radiais
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16 + (Math.random() - 0.5) * 0.3;
      const spd = 3 + Math.random() * 4;
      sparks.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: 1.0,
        decay: 0.035 + Math.random() * 0.03,
        size: 2 + Math.random() * 2
      });
    }
  }

  function triggerLightning(startX, startY) {
    const candidates = [];
    const searchRadius = 150;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const p = points[r][c];
        const dist = Math.hypot(p.x - startX, p.y - startY);
        if (dist > 25 && dist < searchRadius) {
          candidates.push(p);
        }
      }
    }

    if (candidates.length === 0) return;

    const targets = Math.min(2, candidates.length);
    for (let t = 0; t < targets; t++) {
      const target = candidates[Math.floor(Math.random() * candidates.length)];
      createLightningBolt(startX, startY, target.x, target.y);
      target.energy = 1.0;

      // Faíscas elétricas no impacto do nó
      for (let s = 0; s < 3; s++) {
        sparks.push({
          x: target.x,
          y: target.y,
          vx: (Math.random() - 0.5) * 3.5,
          vy: (Math.random() - 0.5) * 3.5,
          life: 0.85,
          decay: 0.045 + Math.random() * 0.04,
          size: 1.5 + Math.random() * 2
        });
      }
    }
  }

  function createLightningBolt(x1, y1, x2, y2) {
    const segments = [];
    const steps = 7;
    let prevX = x1;
    let prevY = y1;

    for (let i = 1; i <= steps; i++) {
      const progress = i / steps;
      const targetX = x1 + (x2 - x1) * progress;
      const targetY = y1 + (y2 - y1) * progress;

      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;

      const jitter = (i === steps) ? 0 : (Math.random() - 0.5) * 26;
      const curX = targetX + nx * jitter;
      const curY = targetY + ny * jitter;

      segments.push({ x1: prevX, y1: prevY, x2: curX, y2: curY });
      prevX = curX;
      prevY = curY;
    }

    lightningArcs.push({
      segments,
      alpha: 1.0,
      decay: 0.12 + Math.random() * 0.08,
      width: 1.8 + Math.random() * 1.2
    });
  }

  function render(time) {
    if (!isVisible) {
      animationFrameId = requestAnimationFrame(render);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    const waveRadius = 180;
    const timeSec = time * 0.002;

    // Disparo elétrico sutil ambiente a cada 2.5 segundos
    if (time - lastPulseTime > 2600) {
      lastPulseTime = time;
      const px = mouse.active ? mouse.x + (Math.random() - 0.5) * 90 : width * 0.35 + (Math.random() - 0.5) * 200;
      const py = mouse.active ? mouse.y + (Math.random() - 0.5) * 90 : height * 0.4 + (Math.random() - 0.5) * 150;
      if (px > 0 && px < width && py > 0 && py < height) {
        triggerLightning(px, py);
      }
    }

    // 1. Atualiza dinâmica dos nós da malha (reação em ondas e amortecimento)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const p = points[r][c];

        if (mouse.active && !prefersReducedMotion) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < waveRadius) {
            const normDist = dist / waveRadius;
            // Equação senoidal de onda propagada a partir do cursor
            const wave = Math.sin(dist * 0.06 - timeSec * 6);
            const force = (1 - normDist) * wave * 7.5;

            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force * 0.35;
            p.vy += Math.sin(angle) * force * 0.35;

            // Energização dos nós próximos
            p.energy = Math.min(1, p.energy + (1 - normDist) * 0.35);
          }
        }

        // Força elástica em direção ao ponto de repouso original
        const fx = (p.originX - p.x) * 0.12;
        const fy = (p.originY - p.y) * 0.12;

        p.vx = (p.vx + fx) * 0.82;
        p.vy = (p.vy + fy) * 0.82;

        p.x += p.vx;
        p.y += p.vy;

        p.energy *= 0.94;
      }
    }

    // 2. Traçado das Linhas Horizontais da Malha
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols - 1; c++) {
        const p1 = points[r][c];
        const p2 = points[r][c + 1];
        const avgEnergy = (p1.energy + p2.energy) * 0.5;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        if (avgEnergy > 0.08) {
          ctx.strokeStyle = `rgba(0, 210, 255, ${0.15 + avgEnergy * 0.6})`;
          ctx.lineWidth = 1 + avgEnergy * 1.5;
        } else {
          ctx.strokeStyle = 'rgba(0, 102, 255, 0.11)';
          ctx.lineWidth = 1;
        }
        ctx.stroke();
      }
    }

    // 3. Traçado das Linhas Verticais da Malha
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows - 1; r++) {
        const p1 = points[r][c];
        const p2 = points[r + 1][c];
        const avgEnergy = (p1.energy + p2.energy) * 0.5;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        if (avgEnergy > 0.08) {
          ctx.strokeStyle = `rgba(0, 210, 255, ${0.15 + avgEnergy * 0.6})`;
          ctx.lineWidth = 1 + avgEnergy * 1.5;
        } else {
          ctx.strokeStyle = 'rgba(0, 102, 255, 0.11)';
          ctx.lineWidth = 1;
        }
        ctx.stroke();
      }
    }

    // 4. Pontos de cruzamento energizados (Glow Elétrico)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const p = points[r][c];
        if (p.energy > 0.15) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5 + p.energy * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 210, 255, ${p.energy * 0.8})`;
          ctx.fill();

          if (p.energy > 0.6) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1 + p.energy * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
          }
        }
      }
    }

    // 5. Renderização dos Raios Elétricos (Alta Tensão / Plasma)
    for (let i = lightningArcs.length - 1; i >= 0; i--) {
      const arc = lightningArcs[i];
      arc.alpha -= arc.decay;

      if (arc.alpha <= 0) {
        lightningArcs.splice(i, 1);
        continue;
      }

      ctx.save();
      // Brilho externo ciano
      ctx.beginPath();
      for (let j = 0; j < arc.segments.length; j++) {
        const s = arc.segments[j];
        if (j === 0) ctx.moveTo(s.x1, s.y1);
        ctx.lineTo(s.x2, s.y2);
      }
      ctx.strokeStyle = `rgba(0, 210, 255, ${arc.alpha * 0.75})`;
      ctx.lineWidth = arc.width + 1.8;
      ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(0, 210, 255, 0.85)';
      ctx.shadowBlur = 10;
      ctx.stroke();

      // Núcleo branco incandescente do raio
      ctx.beginPath();
      for (let j = 0; j < arc.segments.length; j++) {
        const s = arc.segments[j];
        if (j === 0) ctx.moveTo(s.x1, s.y1);
        ctx.lineTo(s.x2, s.y2);
      }
      ctx.strokeStyle = `rgba(255, 255, 255, ${arc.alpha})`;
      ctx.lineWidth = Math.max(1, arc.width * 0.6);
      ctx.shadowBlur = 0;
      ctx.stroke();
      ctx.restore();
    }

    // 6. Renderização das Faíscas
    for (let i = sparks.length - 1; i >= 0; i--) {
      const sp = sparks[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.vx *= 0.94;
      sp.vy *= 0.94;
      sp.life -= sp.decay;

      if (sp.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.size * sp.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 230, 255, ${sp.life * 0.85})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(sp.x, sp.y, (sp.size * 0.5) * sp.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${sp.life})`;
      ctx.fill();
    }

    animationFrameId = requestAnimationFrame(render);
  }

  // Observer de interseção para pausar quando fora de visão
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
    });
  }, { threshold: 0.05 });
  observer.observe(heroSection);

  window.addEventListener('resize', debounce(resize, 150));

  resize();
  animationFrameId = requestAnimationFrame(render);
}

/* --- 5. MENU MOBILE ACESSÍVEL (DIALOG, FOCUS TRAP, ESCAPE KEY) --- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNavDrawer');
  const closeBtn = document.getElementById('closeMobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileNav) return;

  function getFocusableElements() {
    return mobileNav.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  }

  function openMenu() {
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');

    // Foco no botão de fechar para usabilidade com leitor de tela
    setTimeout(() => {
      if (closeBtn) closeBtn.focus();
    }, 50);

    document.addEventListener('keydown', handleKeyDown);
  }

  function closeMenu() {
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    toggleBtn.setAttribute('aria-expanded', 'false');

    document.removeEventListener('keydown', handleKeyDown);

    // Devolve o foco ao botão que disparou a abertura
    toggleBtn.focus();
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu();
      return;
    }

    if (e.key === 'Tab') {
      const focusable = getFocusableElements();
      if (!focusable.length) return;

      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* --- 6. SCROLL SPY PARA NAVEGAÇÃO ATIVA --- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* --- 7. NAVBAR DINÂMICA (TRANSPARENTE NO TOPO -> FOSCO E LEVEMENTE COMPACTO AO ROLAR) --- */
function initNavbarScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  function updateNavbar() {
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
}

/* --- 8. MOTOR NATIVO DE REVELAÇÃO AO ROLAR (SCROLL REVEAL EM CASCATA) (1.1) --- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  // Se prefers-reduced-motion estiver ativo, revela tudo imediatamente
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --- 9. CONTADORES NUMÉRICOS ANIMADOS (COUNT-UP) (1.3) --- */
function initCountUp() {
  const countElements = document.querySelectorAll('.count-up-value');
  const statsSection = document.getElementById('aboutStatsGrid');
  if (!countElements.length || !statsSection) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    countElements.forEach(el => {
      el.textContent = el.getAttribute('data-count-target') || '0';
    });
    return;
  }

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        obs.unobserve(entry.target);

        countElements.forEach(el => {
          const target = parseInt(el.getAttribute('data-count-target'), 10) || 0;
          const duration = 1600; // ms
          const startTime = performance.now();

          function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);
            const currentVal = Math.floor(ease * target);
            el.textContent = currentVal;

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = target;
            }
          }
          requestAnimationFrame(step);
        });
      }
    });
  }, {
    threshold: 0.25
  });

  observer.observe(statsSection);
}

/* --- 10. EFEITO PARALLAX SUTIL DE FUNDO TÉCNICO (1.4) --- */
function initParallax() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const heroBg = document.querySelector('.hero-bg-grid');
  if (!heroBg) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        if (scrolled < 1200) {
          heroBg.style.transform = `translate3d(0, ${scrolled * 0.12}px, 0)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* --- 11. GALERIA DE PROJETOS LIGHTBOX / MODAL ACESSÍVEL (2.2) --- */
function initProjectLightbox() {
  const modal = document.getElementById('projectLightboxModal');
  const closeBtn = document.getElementById('closeProjectModal');
  const projectCards = document.querySelectorAll('.project-card');

  if (!modal || !closeBtn || !projectCards.length) return;

  const modalImg = document.getElementById('modalProjectImg');
  const modalTitle = document.getElementById('modalProjectTitle');
  const modalCategory = document.getElementById('modalProjectCategory');
  const modalLocationText = document.getElementById('modalProjectLocationText');
  const modalDesc = document.getElementById('modalProjectDesc');
  const modalSpecsList = document.getElementById('modalProjectSpecsList');
  const modalCta = document.getElementById('modalProjectCta');

  let lastFocusedElement = null;

  function openModal(card) {
    lastFocusedElement = card;

    const title = card.getAttribute('data-title') || 'Projeto Eletrotec';
    const cat = card.getAttribute('data-category-label') || 'Engenharia';
    const location = card.getAttribute('data-location') || 'Taiobeiras — MG';
    const desc = card.getAttribute('data-desc') || '';
    const specs = (card.getAttribute('data-specs') || '').split('|').filter(Boolean);
    const img = card.getAttribute('data-img') || '';

    if (modalImg) {
      modalImg.src = img;
      modalImg.alt = title;
    }
    if (modalTitle) modalTitle.textContent = title;
    if (modalCategory) modalCategory.textContent = cat;
    if (modalLocationText) modalLocationText.textContent = location;
    if (modalDesc) modalDesc.textContent = desc;

    if (modalSpecsList) {
      modalSpecsList.innerHTML = specs.map(s => `<li>${s}</li>`).join('');
    }

    if (modalCta) {
      const msg = `Olá! Vi o projeto "${title}" no site da Eletrotec e gostaria de solicitar uma avaliação semelhante para minha necessidade.`;
      modalCta.href = `https://wa.me/5538992115723?text=${encodeURIComponent(msg)}`;
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    setTimeout(() => closeBtn.focus(), 50);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  projectCards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --- 12. FAQ SANFONADO ACESSÍVEL (2.3) --- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Fecha outros itens para navegação limpa
      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('is-open')) {
          other.classList.remove('is-open');
          const otherTrigger = other.querySelector('.faq-trigger');
          const otherContent = other.querySelector('.faq-content');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherContent) otherContent.setAttribute('hidden', 'true');
        }
      });

      if (isOpen) {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        content.setAttribute('hidden', 'true');
      } else {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        content.removeAttribute('hidden');
      }
    });
  });
}

/* --- 13. SPOTLIGHT BORDER HOVER EFFECT (3.1) --- */
function initSpotlightHover() {
  const cards = document.querySelectorAll('.spotlight-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--mouse-x', `-999px`);
      card.style.setProperty('--mouse-y', `-999px`);
    });
  });
}

