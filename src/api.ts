// import config from 'config'
import { Gitlab } from 'gitlab'

const RE_ROADMAP_LABELS = /^°\s/

interface Project {
  id: number,
  name: string,
  web_url: string,
}


interface Issue {
  id: number,
  iid: number,
  title: string,
  description: string,
  state: string,
  web_url: string,
  labels: Array<string>,
}

interface Item extends Issue {
  priority: string
}

interface Label {
  id: number,
  name: string,
  description: string
}

interface Category extends Label {
  link: string,
  items: Array<Item>
}

export interface RoadmapExtractOptions {
  host: (string | undefined),
  pid: number,
  token: (string | undefined),
  template: 'classic' | 'full' | 'light' | 'slides',
}

const print = (...args: any[]) => console.log(...args)

function templateDefault (results:Array<Category>, full = false) {
  for (let cat of results) {
    print(`## [☉](${cat.link}) ${cat.name.substr(2)}\n`)
    print(`${cat.description}\n`)

    for (let item of cat.items) {
      print(`- ${item.title} [${item.priority}] ([#${item.iid}](${item.web_url}))`)
      if (full && (item.description.trim() !== '')) {
        // Indent
        print(item.description.trim().split('\n').map(s => '   ' + s).join('\n'))
      }
    }
    print()
  }
}

function templateFull(results:Array<Category>) {
  return templateDefault(results, true)
}

function templateLight (results:Array<Category>, full = false) {
  for (let cat of results) {
    print(`- [☉](${cat.link}) ${cat.name.substr(2)} - ${cat.description}`)

    for (let item of cat.items) {
      print(`  - ${item.title} [${item.priority}] ([#${item.iid}](${item.web_url}))`)
    }
  }
}

function templateSlides (results:Array<Category>) {
  print('# Roadmap\n')
  for (let cat of results) {
    print(`- [☉](${cat.link}) ${cat.name.substr(2)}`)
  }
  print('\n---\n')
  for (let cat of results) {
    print(`# [☉](${cat.link}) ${cat.name.substr(2)}\n`)
    print(`> ${cat.description}\n`)
    if (cat.items.length) {
      for (let item of cat.items) {
        print(`- ${item.title} [${item.priority}] ([#${item.iid}](${item.web_url}))`)
      }
      for (let item of cat.items) {
        print('\n----\n')
        print(`## ${item.title} [${item.priority}] ([#${item.iid}](${item.web_url}))\n`)
        print(`${item.description || ''}`)
      }
    }
    print('\n---\n')

  }
  // for (let cat of results) {
  //   print(`## [☉](${cat.link}) ${cat.name.substr(2)}\n`)
  //   print(`${cat.description}\n`)
  //
  //   for (let item of cat.items) {
  //     print(`- ${item.title} [${item.priority}] ([#${item.iid}](${item.web_url}))`)
  //     if (full && (item.description.trim() !== '')) {
  //       // Indent
  //       print(item.description.trim().split('\n').map(s => '   ' + s).join('\n'))
  //     }
  //   }
  //   print()
  // }
}

const templates = {
  classic: templateDefault,
  full: templateFull,
  light: templateLight,
  slides: templateSlides,
}



export async function roadmapExport (options: RoadmapExtractOptions): Promise<Array<Category>> {

  const { host, pid, token, template } = options

  const api = new Gitlab({ host, token })

  const project = await api.Projects.show(pid) as Project


  const labels = (await api.Labels.all(pid) as Array<Label>)
    .filter((label: Label) => RE_ROADMAP_LABELS.test(label.name))

  const results: Array<Category> = []

  // For each labels print issue summary:
  for (let label of labels) {
    const link = `${project.web_url}/issues?scope=all&utf8=✓&label_name[]=${encodeURIComponent(label.name)}`
    const category: Category = { ...label, link, items: [] }
    results.push(category)
    // print(`## [☉](${link}) ${label.name.substr(2)}\n`)

    const issues = (await api.Issues.all({ projectId: pid, labels: label.name }) as Array<Issue>)

    for (let issue of issues) {
      const item:Item = { ...issue, priority: 'normal' }

      const pLabel = issue.labels.find(p => /^priority:/.test(p))
      item.priority = pLabel ? pLabel.split(':')[1] : 'normal'

      category.items.push(item)
      //
      // print(`- ${issue.title} [${priority}] ([#${issue.iid}](${issue.web_url}))`)
      // if (!slides && (issue.description.trim() !== '')) {
      //   // Indent
      //   print(issue.description.split('\n').map(s => '   ' + s).join('\n'))
      // }
    }
    // print(`\n---\n`)
  }

  // print(template, templates[template])
  templates[template](results)

  return results
}
