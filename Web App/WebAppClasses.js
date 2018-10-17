var Types = {
}; //used to keep track of class types


class fieldEntry
{
	constructor(valid, str_data)
	{
        if (valid === undefined)
        {
            this.valid = true;
        }
        else
        {
            this.valid = valid;
        }

        if (str_data === undefined)
        {
            this.str_data = "";
        }
        else
        {
            this.str_data = str_data;
        }
	}

	getData()
	{
		return this.str_data;
	}

	setData(string)
	{
		this.str_data = string;
	}

	getValidity()
	{
		return this.valid;
	}

	setValidity(state)
	{
		this.valid = state;
	}

	toJSON()
	{
		return {
			__type: 'fieldEntry',
			valid: this.valid,
			str_data: this.str_data
		};
	}
}

fieldEntry.revive = function(data)
{
	return new fieldEntry(data.valid, data.str_data);
};

Types.fieldEntry = fieldEntry;

class Page
{
	constructor(valid, name, page_data)
	{
        if (!(valid === undefined) && name === undefined && page_data === undefined ) //parameters: page_number
        {
            var page_number = valid;

            this.valid = true;
            this.name = convert_index_to_readable_name(page_number);
            this.page_data = new Array();
            for(var j = 0; j < 61; j++)
            {
                var checklist_names = this.name;
                var field_value = new fieldEntry(); //entry within page

                if (checklist_names == "Default" || checklist_names == "SHIFT")
                {
                    field_value.setData(get_placeholder_table(get_placeholder_index(this.name))[j]);
                }
                else
                {
                    field_value.setData(checklist_names + " + " + get_placeholder_table(get_placeholder_index(this.name))[j]);
                }

                if (page_number == 0) //page starts in default
                {
                    document.getElementById("key" + j).value = field_value.getData();
                }

                this.page_data.push(field_value);
            }
        }
		else if (valid === undefined && !(name === undefined) && !(page_data === undefined))
		{
			this.valid = true;
			this.name = convert_index_to_readable_name(name);
			this.page_data = new Array();
            for (var i = 0; i < 61; i++)
            {
                this.page_data[i] = fieldEntry.revive(page_data[i]);
            }
		}
        else
        {
            this.valid = valid;
            this.name = name;
            this.page_data = new Array();
            for (var i = 0; i < 61; i++)
            {
                this.page_data[i] = fieldEntry.revive(page_data[i]);
            }
        }
	}


	toJSON()
	{
		return {
			__type: 'Page',
			valid: this.valid,
			name: this.name,
			page_data: this.page_data
		};
	}
	
	getData(i)
	{
		return this.page_data[i];
	}
}

Page.revive = function(data)
{
	return new Page(data.valid, data.name, data.page_data);
}

Types.Page = Page;

class SiteData //value_Array
{
	constructor(data)
	{
        if (data === undefined)
        {
            this.data = new Array();
            for(var i = 0; i < 16; i++)
            {
                var page = new Page(i);//{name: convert_index_to_readable_name(i), page_data: []}; //specific page of website
                this.addPage(page);
            }
        }
        else
        {
            this.data = new Array();
            for (var i = 0; i < 16; i++)
            {
                this.data[i] = Page.revive(data.data[i]);
            }
        }
	}


	addPage(page)
	{
		this.data.push(page);
	}

	updatePage(index, page)
	{
		this.data[index] = page;
	}

	getPage(index)
	{
		return this.data[index];
	}

	retrieve_page_by_name(name)
	{
		var index = convert_readable_name_to_index(name);

		return this.data[index];
	}

	toJSON()
	{
		return {
			__type: 'SiteData',
			data: this.data
		};
	}
}

SiteData.revive = function(data)
{
	return new SiteData(data);
}

Types.SiteData = SiteData;
