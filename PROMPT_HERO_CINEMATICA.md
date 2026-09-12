# Hero Cinemática — Prompt de Implementação

## Visão Geral
Evoluir a hero da landing Otávio Milhas com três sistemas de animação interativa:
1. **Parallax + Drift automático** nas fotos (com pausa ao hover)
2. **Botão magnético** para WhatsApp (desktop) / flutuante discreto (mobile)
3. **Bandeiras decorativas** ao redor da hero em movimento sutil

## Decisões Travadas

1. **Parallax + Drift:** As fotos se movem continuamente em drift automático, respondem em tempo real ao movimento do mouse (parallax), e pausam a animação de drift quando o mouse está sobre o deck. O sistema de drag (arrasto) continua funcionando normalmente.

2. **Botão Magnético (Desktop):** Um botão para WhatsApp que se comporta como um ímã — puxa visualmente para o cursor do mouse enquanto mantém sua posição na coluna de texto. Efeito de atração suave.

3. **Botão Flutuante (Mobile):** No mobile, o botão magnético vira um botão flutuante discreto (não compete com o conteúdo). Mantém a funcionalidade WhatsApp sem efeito de atração.

4. **Bandeiras Decorativas:** Padrão solto (não órbita geométrica), ao redor da hero, em movimento contínuo e discreto. Nunca deve puxar atenção do conteúdo principal.

5. **Stack Technical:** Context API para gerenciar estado global (`mousePos`, `isDriftPaused`, `parallaxOffset`), garantindo sincronização entre todos os sistemas.

## Requisitos Funcionais

### Sistema de Parallax + Drift
- [ ] Movimento automático contínuo dos cartões (drift) quando o mouse não está sobre o deck
- [ ] Pausa do drift quando o mouse entra na área do deck
- [ ] Resposta em tempo real ao movimento do mouse (parallax) enquanto está sobre o deck
- [ ] O drag (arrasto manual) continua funcionando normalmente
- [ ] Respei­ta `prefers-reduced-motion` (pausa todos os movimentos automáticos)
- [ ] Suave em mobile (sem parallax intenso; drift opcional)

### Botão Magnético
- **Desktop:**
  - [ ] Botão posicionado na coluna de texto (provavelmente substituindo ou complementando o WhatsAppLink existente)
  - [ ] Segue o cursor com efeito de atração visual (não é ímã de verdade, é visual)
  - [ ] Volta à posição original quando mouse sai
  - [ ] Animação suave (150-250ms nas interações)
  - [ ] Mantém interatividade e hit box normal
- **Mobile:**
  - [ ] Botão flutuante discreto (tipo o BotaoFlutuante existente)
  - [ ] Sem efeito de atração (seria confuso em touch)
  - [ ] Visível mas não competindo com CTA principal

### Bandeiras Decorativas
- [ ] Padrão solto ao redor da hero (não órbita exata)
- [ ] Movimento contínuo sutil
- [ ] Opacidade baixa (20-30% máximo)
- [ ] Escala pequena (não deve ser notada como elemento principal)
- [ ] Respei­ta `prefers-reduced-motion`

## Arquitetura Recomendada

### 1. Context de Mouse Global
```
HeroMouseContext.tsx
├─ mousePos: { x, y }
├─ isDriftPaused: boolean
├─ parallaxOffset: { x, y }
└─ Mouse listener centralizado
```

### 2. Componentes Novos
```
components/
├─ hero/
│  ├─ HeroParallaxProvider.tsx (wrapper do Context)
│  ├─ BotaoMagneticoWhatsApp.tsx (desktop + mobile)
│  ├─ BandeirasDecorativas.tsx
│  └─ DeckViagens.tsx (atualizado)
```

### 3. Integração no Hero
- `Hero.tsx` exporta `DeckViagens` dentro do `HeroParallaxProvider`
- `BotaoMagneticoWhatsApp` substitui o `WhatsAppLink` existente (ou se adiciona junto)
- `BandeirasDecorativas` renderiza na seção hero (posicionamento absoluto/fixed)

## Regras de Código

- **Cores:** Só tokens de `@theme` em `app/globals.css`
- **Strings:** Tudo em `content/site.ts` (mensagens de acessibilidade, etc)
- **Imagens:** `next/image` em tudo
- **Animations:** 150-250ms para interação, respei­tar `prefers-reduced-motion`
- **Performance:** Mouse listeners em refs, não re-renders desnecessários (use RAF)
- **Acessibilidade:** ARIA labels, focus states visíveis, funcionalidade sem JS degradada

## Verificação Antes de Commit

```bash
npx vitest run && npm run lint && npm run build
```

## Próximos Passos

1. Invocar **superpowers:brainstorming** para validar arquitetura ✓ (você já fez)
2. Invocar **landing-premium:estrutura-e-copy** (se houver mudança de copy)
3. Invocar **design-taste-frontend** (direção visual das bandeiras)
4. Invocar **landing-premium:construir-landing** (implementação)
5. Invocar **animate** (refinamento das animações)
6. Invocar **superpowers:requesting-code-review** (antes de merge)

---

**Criado:** 2026-09-12  
**Status:** Pronto para implementação  
**Prioridade:** Alta (hero é o ponto de entrada da landing)
