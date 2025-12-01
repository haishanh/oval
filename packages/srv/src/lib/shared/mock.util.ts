const CODE_FENCE = '```';

const sample = [
  `${CODE_FENCE}json`,

  '{',
  '  "blocked": false,',
  '  "details": [',
  '    {',
  '      "label": "核心决定与日期",',
  '      "icon": "GitBranch",',
  '      "info": "从2025年11月26日起，我们已将Zig的主要项目仓库从GitHub迁移到Codeberg（`https://codeberg.org/ziglang/zig`），并立即将GitHub仓库设置为只读状态。"',
  '    },',
  '    {',
  '      "label": "迁移主要原因",',
  '      "icon": "Bug",',
  '      "info": "由于微软收购后工程文化衰退，GitHub Actions出现了“vibe-scheduling”（随机调度）以及无法容忍的错误，导致我们的持续集成(CI)系统完全崩溃，浪费了我们本可用于购买CI硬件的捐款。"',
  '    },',
  '    {',
  '      "label": "捐赠平台变更",',
  '      "icon": "Wallet",',
  '      "info": "尽管GitHub Sponsors仍是我们收入的重要部分，但我们现在视其为负资产，并恳请现有捐助者将定期捐赠转移到非营利组织Every.org，同时取消GitHub Sponsors的赞助福利（例如在主页或发布说明中显示名称的权限）。"',
  '    },',
  '    {',
  '      "label": "捐赠平台变更",',
  '      "icon": "Wallet",',
  '      "info": "尽管GitHub Sponsors仍是我们收入的重要部分，但我们现在视其为负资产，并恳请现有捐助者将定期捐赠转移到非营利组织Every.org，同时取消GitHub Sponsors的赞助福利（例如在主页或发布说明中显示名称的权限）。"',
  '    },',
  '    {',
  '      "label": "捐赠平台变更",',
  '      "icon": "Wallet",',
  '      "info": "尽管GitHub Sponsors仍是我们收入的重要部分，但我们现在视其为负资产，并恳请现有捐助者将定期捐赠转移到非营利组织Every.org，同时取消GitHub Sponsors的赞助福利（例如在主页或发布说明中显示名称的权限）。"',
  '    },',
  '    {',
  '      "label": "捐赠平台变更",',
  '      "icon": "Wallet",',
  '      "info": "尽管GitHub Sponsors仍是我们收入的重要部分，但我们现在视其为负资产，并恳请现有捐助者将定期捐赠转移到非营利组织Every.org，同时取消GitHub Sponsors的赞助福利（例如在主页或发布说明中显示名称的权限）。"',
  '    }',
  '  ]',
  '}',

  CODE_FENCE
].join('\n');

// get random int in range [min, max)
function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

export function generate() {
  let i = 0;
  return {
    async *[Symbol.asyncIterator]() {
      while (i < sample.length) {
        const j = Math.min(i + getRandomInt(10, 35), sample.length);
        const text = sample.substring(i, j);
        i = j;
        yield text;
      }
    }
  };
}
