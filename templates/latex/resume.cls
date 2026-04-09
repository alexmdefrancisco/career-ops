%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Medium Length Professional CV - RESUME CLASS FILE
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\ProvidesClass{resume}[2010/07/10 v0.9 Resume class]
\LoadClass[10pt,letterpaper]{article} % Reduced font size to 10pt for more space
\usepackage[utf8]{inputenc} % Added for UTF-8 support to enable icons
\usepackage[T1]{fontenc} % Added for better font encoding
\usepackage{fontawesome} % Added for FontAwesome icons
\usepackage[parfill]{parskip} % Remove paragraph indentation
\usepackage{array} % Required for boldface (\bf and \bfseries) tabular columns
\usepackage{ifthen} % Required for ifthenelse statements
\pagestyle{empty} % Suppress page numbers

% Icon commands for address items
\newcommand{\phonesymbol}{\faPhone}
\newcommand{\emailsymbol}{\faAt}
\newcommand{\githubsymbol}{\faGithub}
\newcommand{\linkedinsymbol}{\faLinkedin}

%----------------------------------------------------------------------------------------
% HEADINGS COMMANDS: Commands for printing name and address
%----------------------------------------------------------------------------------------
\def \name#1{\def\@name{#1}} % Defines the \name command to set name
\def \@name {} % Sets \@name to empty by default
\def \addressSep {\quad} % Changed to space/quad (removed diamond); use with icons in \address
% One, two or three address lines can be specified
\let \@addressone \relax
\let \@addresstwo \relax
\let \@addressthree \relax
% \address command can be used to set the first, second, and third address (last 2 optional)
\def \address #1{
  \@ifundefined{@addresstwo}{
    \def \@addresstwo {#1}
  }{
  \@ifundefined{@addressthree}{
  \def \@addressthree {#1}
  }{
     \def \@addressone {#1}
  }}
}
% \printaddress is used to style an address line (given as input)
\def \printaddress #1{
  \begingroup
    \def \\ {\addressSep }
    \centerline{#1}
  \endgroup
  \par
  \addressskip
}
% \printname is used to print the name as a page header
\def \printname {
  \begingroup
    \hfil{\MakeUppercase{\namesize\bf \@name}}\hfil
    \nameskip\break
  \endgroup
}
%----------------------------------------------------------------------------------------
% PRINT THE HEADING LINES
%----------------------------------------------------------------------------------------
\let\ori@document=\document
\renewcommand{\document}{
  \ori@document % Begin document
  \printname % Print the name specified with \name
  \@ifundefined{@addressone}{}{ % Print the first address if specified
    \printaddress{\@addressone}}
  \@ifundefined{@addresstwo}{}{ % Print the second address if specified
    \printaddress{\@addresstwo}}
     \@ifundefined{@addressthree}{}{ % Print the third address if specified
    \printaddress{\@addressthree}}
}
%----------------------------------------------------------------------------------------
% SECTION FORMATTING
%----------------------------------------------------------------------------------------
% Defines the rSection environment for the large sections within the CV
\newenvironment{rSection}[1]{ % 1 input argument - section name
  \sectionskip
  \MakeUppercase{\bf #1} % Section title
  \sectionlineskip
  \hrule % Horizontal line
  \begin{list}{}{ % List for each individual item in the section
    \setlength{\leftmargin}{1.5em} % Margin within the section
  }
  \item[]
}{
  \end{list}
}
%----------------------------------------------------------------------------------------
% WORK EXPERIENCE FORMATTING
%----------------------------------------------------------------------------------------
\newenvironment{rSubsection}[4]{ % 4 input arguments - company name, year(s) employed, job title and location
 {\bf #1} \hfill {#2} % Bold company name and date on the right
 \ifthenelse{\equal{#3}{}}{}{ % If the third argument is not specified, don't print the job title and location line
  \\
  {\em #3} \hfill {\em #4} % Italic job title and location
  }\smallskip
  \begin{list}{$\cdot$}{\leftmargin=0em} % \cdot used for bullets, no indentation
   \itemsep -0.5em \vspace{-0.5em} % Compress items in list together for aesthetics
  }{
  \end{list}
  \vspace{0.25em} % Reduced space after the list of bullet points
}
% The below commands define the whitespace after certain things in the document
\def\namesize{\huge} % Size of the name at the top of the document
\def\addressskip{\smallskip} % The space between the two address (or phone/email) lines
\def\sectionlineskip{\smallskip} % Reduced space above the horizontal line for each section
\def\nameskip{\medskip} % Reduced space after your name at the top
\def\sectionskip{\smallskip} % Reduced space after the heading section
