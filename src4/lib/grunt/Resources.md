## Example

```xml
<?xml version="1.0" encoding="utf-8"?>
<AkraResources>
  <Project Name="project1">
    
    <Variable Name="AE_DEBUG">$('Configuration') == 'Debug'</Variable>
    <Variable Name="AE_VERSION">$('Version').full</Variable>
    
    <Attachment Name="AE_ATTACHMENT_1">
      <File Path="file0" />
      <UseInlining>True</UseInlining>
    </Attachment>

    <Resource Name="AE_DEPS_1">
      <Filename>akra</Filename>
      
      <PropertyGroup  Condition="$('Configuration') == 'Debug'">
        <Archive>True</Archive>
        <UseInlining>False</UseInlining>
        <Data>
          <File Path="file1" />
          <Resource Path="resource1">
            <Resource Path="subresource1.1" >
              <Resource Path="subresource.1.1.1" />
            </Resource>
        </Data>
      </PropertyGroup>

      <PropertyGroup  Condition="$('Configuration') == 'Release'">
        <Archive>True</Archive>
        <UseInlining>True</UseInlining>
        <Data>
          ...
        </Data>
      </PropertyGroup>
    </Resource>
  </Project>
  <Project>
    ...
  </Project>
</AkraResources>
```

## Common

The root tag must be:

```
 <AkraResources></AkraResources>
```

Inside the tag **&lt;AkraResources /&gt;** can be used only tag **&lt;Project /&gt;**.

### Project

***

#### Introduction

Declares the project section.

#### Concepts

The **&lt;Project/&gt;** element describe all information about project.

#### Attributes

The **&lt;Project/&gt;** element has the folowing attributes:

| Attribute    | Type       | Description                                 |
| ------------ | ---------- | ------------------------------------------- |
| **Name**     | **string** | The name of project specified in gruntfile. |


#### Child Elements

| Name/Example            | Description         | Default  | Occurrences |
| ----------------------- | ------------------- | -------- | ----------- |
| **&lt;Variable/&gt;**   | Declare variable.   |    N/A   | 0 or more   |
| **&lt;Attachment/&gt;** | Declare attachment. |    N/A   | 0 or more   |
| **&lt;Resource/&gt;**   | Declare resource.   |    N/A   | 0 or more   |

#### Details

#### Example

```xml
  <Project Name="project1">
    <Variable Name="AE_DEBUG">$('Configuration') == 'Debug'</Variable>
  </Project>
```
