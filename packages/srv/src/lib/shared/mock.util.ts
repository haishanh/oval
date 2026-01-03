const CODE_FENCE = '```';

const sampleEnglish = [
  `${CODE_FENCE}json`,

  '{',
  '  "details": [',
  '    {',
  '      "label": "Migration Announcement",',
  '      "icon": "GitBranch",',
  '      "info": "Effective immediately on November 26, 2025, Zig has migrated from GitHub to Codeberg; the canonical repository is now https://codeberg.org/ziglang/zig.git, and the GitHub repo ziglang/zig is read-only."',
  '    },',
  '    {',
  '      "label": "Reasons for Leaving GitHub",',
  '      "icon": "AlertCircle",',
  '      "info": "GitHub\'s engineering excellence has rotted into bloated, buggy JavaScript; GitHub Actions has inexcusable bugs like vibe-scheduling (e.g., https://github.com/actions/runner/issues/3792) causing CI backups even on master; plus ties to ICE and aggressive AI promotion violating our strict no-LLM policy (exhibits https://github.com/ziglang/zig/pull/25974)."',
  '    },',
  '    {',
  '      "label": "GitHub Sponsors Transition",',
  '      "icon": "DollarSign",',
  '      "info": "GitHub Sponsors remains a large revenue source but is now a liability with declining quality post-Devon Zuegel; please move recurring donations to https://every.org/zsf/, where we\'re implementing equivalent perks like homepage and release notes listings."',
  '    },',
  '    {',
  '      "label": "Issue and PR Handling",',
  '      "icon": "MessageCircle",',
  '      "info": "GitHub issues stay open and unmigrated as \'copy-on-write\'; Codeberg issues start at #30000 for unambiguous numbering; we\'ll continue monitoring existing GitHub PRs and issues—only migrate yours if editing, commenting, or rebasing."',
  '    },',
  '    {',
  '      "label": "Thanks and Philosophy",',
  '      "icon": "Heart",',
  '      "info": "Gratitude to Forgejo contributors and Codeberg team (Earl Warren, Otto, Gusted, Mathieu Fenniak) for migration help; in this era of platform capitalism, non-profits like Codeberg defend the commons."',
  '    }',
  '  ]',
  '}',

  CODE_FENCE,
].join('\n');

const sampleChinese = [
  `${CODE_FENCE}json`,

  '{',
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

  CODE_FENCE,
].join('\n');

// get random int in range [min, max)
function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

export function generate(lang = 'English') {
  let i = 0;
  const sample = lang === 'English' ? sampleEnglish : sampleChinese;
  return {
    async *[Symbol.asyncIterator]() {
      while (i < sample.length) {
        const j = Math.min(i + getRandomInt(10, 35), sample.length);
        const text = sample.substring(i, j);
        i = j;
        yield text;
      }
    },
  };
}
