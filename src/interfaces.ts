enum Order {
    None,
    Ascending,
    Descending
}

enum ViewMode {
    Grid,
    Detail,
    Compact
}

interface IOption {
    value: string
    icon: string
    bg?: string
    fg?: string
}

interface ICategory {
    name: string
    icon: string
    options: IOption[]
}

interface ITag {
    type: string
    value: string
}

interface ICard {
    name: string
    image: string
    added: number
    updated: number
    tags: ITag[]
}

export {
    ICard,
    Order,
    ITag,
    ICategory,
    IOption,
    ViewMode
}