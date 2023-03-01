import { FC, useState } from "react"
import { RootState, useAppSelector } from "../../store/store"
import { Autocomplete, TextField, UseAutocompleteProps } from "@mui/material"
import { useSnackbar } from "notistack"
import { matchSorter } from "match-sorter"
import { Tag } from "../../../../common/common-types"
import { useTranslation } from "react-i18next"


interface TagsAreaProps {
  value: Tag[]
  setValue: (tags: Tag[]) => void
  freeSolo?: boolean
  placeholder?: string
}

export const TagsArea: FC<TagsAreaProps> = ({ value, setValue, freeSolo = true, placeholder = 'tags' }) => {
  const {t} = useTranslation()
  const { enqueueSnackbar: snackbar } = useSnackbar()
  const tags = useAppSelector((state: RootState) => state.item.tags)
  const [inputValue, setInputValue] = useState('')
  type AutocompleteProps = UseAutocompleteProps<Tag, true, false, true>

  const tagsHandler: AutocompleteProps['onChange'] = (...args) => {
    const [_, values, reason, details] = args
    if (reason !== 'removeOption' && value.find(tag => tag.name === getTagName(details?.option))) {
      return snackbar('This tag already exists')
    }
    setValue(values.map(value => typeof value === 'string' ? { name: value } : value))
  }

  const inputHandler = (value: string) => {
    setInputValue(value)
  }

  const getTagName = (option?: string | Tag) => {
    if (!option) return ''
    return typeof option === "string" ? option : option.name
  }

  const filterOptions: AutocompleteProps['filterOptions'] = (options, {inputValue}) => {
    return matchSorter(options, inputValue, { keys: ['name'] })
  }

  return (
    <Autocomplete
      disablePortal
      clearOnEscape
      freeSolo={freeSolo}
      noOptionsText={t('No tags found')}
      autoComplete
      multiple
      options={tags}
      size="small"
      value={value}
      onChange={tagsHandler}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => inputHandler(newInputValue)}
      getOptionLabel={getTagName}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      filterOptions={filterOptions}
      filterSelectedOptions
      renderInput={params => <TextField {...params} size="small" label={t(placeholder)}/>}
    />
  )
}
