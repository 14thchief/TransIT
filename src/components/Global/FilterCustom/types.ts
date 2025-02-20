
export interface FilterType {
  type: "date" | "select"
  groupID: string
  options?: FilterOptionType[]
  selectedOption?: FilterOptionType["value"] | object
}

export interface FilterOptionType { 
  label: string | number 
  value: string | number 
}

export interface FilterCustomPropType {
  filters: FilterType[]
  onApplyFilter: (selectedFilters: SelectedFilters)=> void
}

export interface SelectedFilters {
  [key: string]: any
  status?: string
  dates?: {
    startDate: string
    endDate: string
  }
}
