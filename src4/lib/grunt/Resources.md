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
